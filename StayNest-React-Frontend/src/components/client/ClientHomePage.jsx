import { useEffect, useState } from "react";
import {
  Eye,
  LogOut,
  Pencil,
  RefreshCw,
  ShieldCheck,
  Trash2,
} from "lucide-react";
import {
  Link,
  useNavigate,
} from "react-router-dom";

import Navbar from "../layout/Navbar";
import Footer from "../layout/Footer";

import HeroSection from "../user/HeroSection";
import PopularDestinations from "../user/PopularDestinations";
import FeaturedHomestays from "../user/FeaturedHomestays";
import StayCategories from "../user/StayCategories";
import ExperiencesSection from "../user/ExperiencesSection";
import WhyChooseUs from "../user/WhyChooseUs";
import TestimonialsSection from "../user/TestimonialsSection";

import ClientEditorModal from "./ClientEditorModal";

import {
  createBenefit,
  createCategory,
  createDestination,
  createExperience,
  createHomestay,
  createTestimonial,
  deleteBenefit,
  deleteCategory,
  deleteDestination,
  deleteExperience,
  deleteHomestay,
  deleteTestimonial,
  getClientHomepageData,
  updateBenefit,
  updateCategory,
  updateClientWebsiteSettings,
  updateDestination,
  updateExperience,
  updateHomestay,
  updateTestimonial,
  uploadClientImage,
} from "../../services/clientContentService";

import {
  removeAuthenticatedAccount,
} from "../../utils/authStorage";

import { getApiErrorMessage } from "../../utils/apiError";

import "../../styles/clientHomePage.css";
import "../../styles/pageApiState.css";

const crudOperations = {
  destination: {
    create: createDestination,
    update: updateDestination,
    delete: deleteDestination,
    collection: "destinations",
  },
  homestay: {
    create: createHomestay,
    update: updateHomestay,
    delete: deleteHomestay,
    collection: "homestays",
  },
  category: {
    create: createCategory,
    update: updateCategory,
    delete: deleteCategory,
    collection: "categories",
  },
  experience: {
    create: createExperience,
    update: updateExperience,
    delete: deleteExperience,
    collection: "experiences",
  },
  benefit: {
    create: createBenefit,
    update: updateBenefit,
    delete: deleteBenefit,
    collection: "benefits",
  },
  testimonial: {
    create: createTestimonial,
    update: updateTestimonial,
    delete: deleteTestimonial,
    collection: "testimonials",
  },
};

function ClientHomePage() {
  const navigate = useNavigate();

  const [content, setContent] =
    useState(null);

  const [editor, setEditor] =
    useState(null);

  const [deleteTarget, setDeleteTarget] =
    useState(null);

  const [loading, setLoading] =
    useState(true);

  const [saving, setSaving] =
    useState(false);

  const [uploading, setUploading] =
    useState(false);

  const [errorMessage, setErrorMessage] =
    useState("");

  const [successMessage, setSuccessMessage] =
    useState("");

  const loadContent = async () => {
    setLoading(true);
    setErrorMessage("");

    try {
      const response =
        await getClientHomepageData();

      setContent(response);
    } catch (error) {
      setErrorMessage(
        getApiErrorMessage(
          error,
          "Unable to load the website editor."
        )
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadContent();
  }, []);

  const showSuccess = (message) => {
    setSuccessMessage(message);

    window.setTimeout(() => {
      setSuccessMessage("");
    }, 3000);
  };

  const openAdd = (type) => {
    setErrorMessage("");

    setEditor({
      type,
      mode: "add",
      item: null,
    });
  };

  const openEdit = (type, item) => {
    setErrorMessage("");

    setEditor({
      type,
      mode: "edit",
      item,
    });
  };

  const handleUpload = async (
    file,
    folder
  ) => {
    setUploading(true);
    setErrorMessage("");

    try {
      return await uploadClientImage(
        file,
        folder
      );
    } catch (error) {
      setErrorMessage(
        getApiErrorMessage(
          error,
          "Unable to upload the image."
        )
      );

      return null;
    } finally {
      setUploading(false);
    }
  };

  const handleSave = async (formData) => {
    setSaving(true);
    setErrorMessage("");

    try {
      if (
        ["navbar", "hero", "footer"].includes(
          editor.type
        )
      ) {
        const updatedSettings =
          await updateClientWebsiteSettings({
            ...content.settings,
            ...formData,
            navigationLinks: undefined,
          });

        setContent((previousContent) => ({
          ...previousContent,
          settings: updatedSettings,
        }));
      } else {
        const operation =
          crudOperations[editor.type];

        const savedItem =
          editor.mode === "add"
            ? await operation.create(formData)
            : await operation.update(
                editor.item.id,
                formData
              );

        setContent((previousContent) => {
          const currentCollection =
            previousContent[
              operation.collection
            ];

          const updatedCollection =
            editor.mode === "add"
              ? [...currentCollection, savedItem]
              : currentCollection.map((item) =>
                  item.id === savedItem.id
                    ? savedItem
                    : item
                );

          return {
            ...previousContent,
            [operation.collection]:
              updatedCollection,
          };
        });
      }

      showSuccess(
        editor.mode === "add"
          ? "Content added successfully."
          : "Changes saved successfully."
      );

      setEditor(null);
    } catch (error) {
      setErrorMessage(
        getApiErrorMessage(
          error,
          "Unable to save the content."
        )
      );
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    const operation =
      crudOperations[deleteTarget.type];

    setSaving(true);
    setErrorMessage("");

    try {
      await operation.delete(
        deleteTarget.item.id
      );

      setContent((previousContent) => ({
        ...previousContent,
        [operation.collection]:
          previousContent[
            operation.collection
          ].filter(
            (item) =>
              item.id !== deleteTarget.item.id
          ),
      }));

      setDeleteTarget(null);
      showSuccess(
        "Content deleted successfully."
      );
    } catch (error) {
      setErrorMessage(
        getApiErrorMessage(
          error,
          "Unable to delete the content."
        )
      );
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = () => {
    removeAuthenticatedAccount();

    navigate("/client/login", {
      replace: true,
    });
  };

  if (loading) {
    return (
      <main className="page-api-state">
        <div className="page-api-loader" />
        <h1>Loading website editor</h1>
      </main>
    );
  }

  if (!content) {
    return (
      <main className="page-api-state">
        <RefreshCw size={42} />
        <h1>Unable to open editor</h1>
        <p>{errorMessage}</p>

        <button
          type="button"
          onClick={loadContent}
        >
          Try again
        </button>
      </main>
    );
  }

  const navbarData = {
    websiteName:
      content.settings.websiteName,
    signInLabel:
      content.settings.signInLabel,
    clientButtonLabel:
      content.settings.clientButtonLabel,
    navigationLinks:
      content.settings.navigationLinks || [],
  };

  const heroData = {
    smallTitle:
      content.settings.heroSmallTitle,
    title: content.settings.heroTitle,
    highlightedText:
      content.settings.heroHighlightedText,
    description:
      content.settings.heroDescription,
    image: content.settings.heroImage,
  };

  return (
    <>
      <Navbar
        clientMode
        navbarData={navbarData}
        onEdit={() =>
          openEdit(
            "navbar",
            content.settings
          )
        }
      />

      {successMessage && (
        <div className="client-success-toast">
          <ShieldCheck size={19} />
          {successMessage}
        </div>
      )}

      <div className="client-preview-toolbar">
        <div>
          <ShieldCheck size={19} />

          <span>
            <strong>Client editing mode</strong>
            Changes are saved to the database.
          </span>
        </div>

        <div>
          <Link to="/" target="_blank">
            <Eye size={17} />
            View website
          </Link>

          <button
            type="button"
            onClick={handleLogout}
          >
            <LogOut size={17} />
            Logout
          </button>
        </div>
      </div>

      <main className="client-homepage">
        <div className="client-hero-wrapper">
          <button
            type="button"
            className="client-floating-edit"
            onClick={() =>
              openEdit(
                "hero",
                content.settings
              )
            }
            title="Edit hero"
          >
            <Pencil size={17} />
          </button>

          <HeroSection
            clientMode
            heroData={heroData}
          />
        </div>

        <PopularDestinations
          clientMode
          destinations={content.destinations}
          onAdd={() =>
            openAdd("destination")
          }
          onEdit={(item) =>
            openEdit("destination", item)
          }
          onDelete={(item) =>
            setDeleteTarget({
              type: "destination",
              item,
            })
          }
        />

        <FeaturedHomestays
          clientMode
          homestays={content.homestays}
          onAdd={() => openAdd("homestay")}
          onEdit={(item) =>
            openEdit("homestay", item)
          }
          onDelete={(item) =>
            setDeleteTarget({
              type: "homestay",
              item,
            })
          }
        />

        <StayCategories
          clientMode
          categories={content.categories}
          onAdd={() => openAdd("category")}
          onEdit={(item) =>
            openEdit("category", item)
          }
          onDelete={(item) =>
            setDeleteTarget({
              type: "category",
              item,
            })
          }
        />

        <ExperiencesSection
          clientMode
          experiences={content.experiences}
          onAdd={() =>
            openAdd("experience")
          }
          onEdit={(item) =>
            openEdit("experience", item)
          }
          onDelete={(item) =>
            setDeleteTarget({
              type: "experience",
              item,
            })
          }
        />

        <WhyChooseUs
          clientMode
          benefits={content.benefits}
          onAdd={() => openAdd("benefit")}
          onEdit={(item) =>
            openEdit("benefit", item)
          }
          onDelete={(item) =>
            setDeleteTarget({
              type: "benefit",
              item,
            })
          }
        />

        <TestimonialsSection
          clientMode
          testimonials={content.testimonials}
          onAdd={() =>
            openAdd("testimonial")
          }
          onEdit={(item) =>
            openEdit("testimonial", item)
          }
          onDelete={(item) =>
            setDeleteTarget({
              type: "testimonial",
              item,
            })
          }
        />
      </main>

      <div className="client-footer-wrapper">
        <button
          type="button"
          className="client-footer-edit"
          onClick={() =>
            openEdit(
              "footer",
              content.settings
            )
          }
          title="Edit footer"
        >
          <Pencil size={17} />
        </button>

        <Footer
          footerData={{
            websiteName:
              content.settings.websiteName,
            description:
              content.settings.footerDescription,
            email:
              content.settings.contactEmail,
            phone:
              content.settings.contactPhone,
            address:
              content.settings.contactAddress,
            navigationLinks:
              content.settings.navigationLinks ||
              [],
          }}
        />
      </div>

      {editor && (
        <ClientEditorModal
          editor={editor}
          saving={saving}
          uploading={uploading}
          errorMessage={errorMessage}
          onClose={() => setEditor(null)}
          onSave={handleSave}
          onUpload={handleUpload}
        />
      )}

      {deleteTarget && (
        <div className="client-editor-overlay">
          <div className="client-delete-dialog">
            <Trash2 size={30} />

            <h2>Delete this content?</h2>

            <p>
              This action cannot be undone.
            </p>

            {errorMessage && (
              <div className="client-editor-error">
                {errorMessage}
              </div>
            )}

            <div>
              <button
                type="button"
                onClick={() =>
                  setDeleteTarget(null)
                }
                disabled={saving}
              >
                Cancel
              </button>

              <button
                type="button"
                className="confirm-delete"
                onClick={handleDelete}
                disabled={saving}
              >
                {saving
                  ? "Deleting..."
                  : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default ClientHomePage;