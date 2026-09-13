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

import Navbar from "../../components/layout/Navbar";
import Footer from "../../components/layout/Footer";

import HeroSection from "../../components/user/HeroSection";
import PopularDestinations from "../../components/user/PopularDestinations";
import FeaturedHomestays from "../../components/user/FeaturedHomestays";
import StayCategories from "../../components/user/StayCategories";
import ExperiencesSection from "../../components/user/ExperiencesSection";
import WhyChooseUs from "../../components/user/WhyChooseUs";
import TestimonialsSection from "../../components/user/TestimonialsSection";

import ClientEditorModal from "../../components/client/ClientEditorModal";
import ClientNavigationManager from "../../components/client/ClientNavigationManager";

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

import {
  getApiErrorMessage,
} from "../../utils/apiError";

import "../../styles/clientHomePage.css";
import "../../styles/pageApiState.css";
import "../../styles/clientEditorModal.css";
import "../../styles/clientNavigationManager.css";

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

  const showSuccessMessage = (message) => {
    setSuccessMessage(message);

    window.setTimeout(() => {
      setSuccessMessage("");
    }, 3000);
  };

  const openAddEditor = (type) => {
    setErrorMessage("");

    setEditor({
      type,
      mode: "add",
      item: null,
    });
  };

  const openEditEditor = (
    type,
    item
  ) => {
    setErrorMessage("");

    setEditor({
      type,
      mode: "edit",
      item,
    });
  };

  const closeEditor = () => {
    if (saving || uploading) {
      return;
    }

    setEditor(null);
    setErrorMessage("");
  };

  const openDeleteDialog = (
    type,
    item
  ) => {
    setErrorMessage("");

    setDeleteTarget({
      type,
      item,
    });
  };

  const closeDeleteDialog = () => {
    if (saving) {
      return;
    }

    setDeleteTarget(null);
    setErrorMessage("");
  };

  const handleImageUpload = async (
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
          "Unable to upload the selected image."
        )
      );

      return null;
    } finally {
      setUploading(false);
    }
  };

  const createWebsitePayload = (
    updatedFields
  ) => {
    const currentSettings =
      content.settings;

    return {
      websiteName:
        updatedFields.websiteName ??
        currentSettings.websiteName,

      signInLabel:
        updatedFields.signInLabel ??
        currentSettings.signInLabel,

      clientButtonLabel:
        updatedFields.clientButtonLabel ??
        currentSettings.clientButtonLabel,

      heroSmallTitle:
        updatedFields.heroSmallTitle ??
        currentSettings.heroSmallTitle,

      heroTitle:
        updatedFields.heroTitle ??
        currentSettings.heroTitle,

      heroHighlightedText:
        updatedFields.heroHighlightedText ??
        currentSettings.heroHighlightedText,

      heroDescription:
        updatedFields.heroDescription ??
        currentSettings.heroDescription,

      heroImage:
        updatedFields.heroImage ??
        currentSettings.heroImage,

      footerDescription:
        updatedFields.footerDescription ??
        currentSettings.footerDescription,

      contactEmail:
        updatedFields.contactEmail ??
        currentSettings.contactEmail,

      contactPhone:
        updatedFields.contactPhone ??
        currentSettings.contactPhone,

      contactAddress:
        updatedFields.contactAddress ??
        currentSettings.contactAddress,
    };
  };

  const handleSave = async (
    formData
  ) => {
    if (!editor) {
      return;
    }

    setSaving(true);
    setErrorMessage("");

    try {
      if (
        ["navbar", "hero", "footer"].includes(
          editor.type
        )
      ) {
        const websitePayload =
          createWebsitePayload(formData);

        const updatedSettings =
          await updateClientWebsiteSettings(
            websitePayload
          );

        setContent((previousContent) => ({
          ...previousContent,

          settings: {
            ...updatedSettings,

            navigationLinks:
              updatedSettings.navigationLinks ||
              previousContent.settings
                .navigationLinks ||
              [],
          },
        }));
      } else {
        const operation =
          crudOperations[editor.type];

        if (!operation) {
          throw new Error(
            "Unsupported content type."
          );
        }

        let savedItem;

        if (editor.mode === "add") {
          savedItem =
            await operation.create(
              formData
            );
        } else {
          savedItem =
            await operation.update(
              editor.item.id,
              formData
            );
        }

        setContent((previousContent) => {
          const currentCollection =
            previousContent[
              operation.collection
            ] || [];

          const updatedCollection =
            editor.mode === "add"
              ? [
                  ...currentCollection,
                  savedItem,
                ]
              : currentCollection.map(
                  (item) =>
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

      showSuccessMessage(
        editor.mode === "add"
          ? "Content added successfully."
          : "Changes saved successfully."
      );

      setEditor(null);
      setErrorMessage("");
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
    if (!deleteTarget) {
      return;
    }

    const operation =
      crudOperations[deleteTarget.type];

    if (!operation) {
      setErrorMessage(
        "Unsupported content type."
      );
      return;
    }

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
              item.id !==
              deleteTarget.item.id
          ),
      }));

      setDeleteTarget(null);

      showSuccessMessage(
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

  const handleNavigationLinksChange = (
    updatedLinks
  ) => {
    setContent((previousContent) => ({
      ...previousContent,

      settings: {
        ...previousContent.settings,
        navigationLinks: updatedLinks,
      },
    }));

    showSuccessMessage(
      "Navigation updated successfully."
    );
  };

  const handleLogout = () => {
    removeAuthenticatedAccount();

    window.dispatchEvent(
      new CustomEvent(
        "staynest:auth-changed"
      )
    );

    navigate("/client/login", {
      replace: true,
    });
  };

  if (loading) {
    return (
      <main className="page-api-state">
        <div className="page-api-loader" />

        <h1>Loading website editor</h1>

        <p>
          Loading website content from the database.
        </p>
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

    title:
      content.settings.heroTitle,

    highlightedText:
      content.settings
        .heroHighlightedText,

    description:
      content.settings.heroDescription,

    image:
      content.settings.heroImage,
  };

  const footerData = {
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
      content.settings.navigationLinks || [],
  };

  return (
    <>
      <Navbar
        clientMode
        navbarData={navbarData}
        onEdit={() =>
          openEditEditor(
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
            <strong>
              Client editing mode
            </strong>

            Changes are saved to the database.
          </span>
        </div>

        <div>
          <ClientNavigationManager
            navigationLinks={
              content.settings
                .navigationLinks || []
            }
            onLinksChange={
              handleNavigationLinksChange
            }
          />

          <Link
            to="/"
            target="_blank"
            rel="noreferrer"
          >
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
              openEditEditor(
                "hero",
                content.settings
              )
            }
            title="Edit hero"
            aria-label="Edit hero"
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
          destinations={
            content.destinations
          }
          onAdd={() =>
            openAddEditor("destination")
          }
          onEdit={(destination) =>
            openEditEditor(
              "destination",
              destination
            )
          }
          onDelete={(destination) =>
            openDeleteDialog(
              "destination",
              destination
            )
          }
        />

        <FeaturedHomestays
          clientMode
          homestays={content.homestays}
          onAdd={() =>
            openAddEditor("homestay")
          }
          onEdit={(homestay) =>
            openEditEditor(
              "homestay",
              homestay
            )
          }
          onDelete={(homestay) =>
            openDeleteDialog(
              "homestay",
              homestay
            )
          }
        />

        <StayCategories
          clientMode
          categories={content.categories}
          onAdd={() =>
            openAddEditor("category")
          }
          onEdit={(category) =>
            openEditEditor(
              "category",
              category
            )
          }
          onDelete={(category) =>
            openDeleteDialog(
              "category",
              category
            )
          }
        />

        <ExperiencesSection
          clientMode
          experiences={
            content.experiences
          }
          onAdd={() =>
            openAddEditor("experience")
          }
          onEdit={(experience) =>
            openEditEditor(
              "experience",
              experience
            )
          }
          onDelete={(experience) =>
            openDeleteDialog(
              "experience",
              experience
            )
          }
        />

        <WhyChooseUs
          clientMode
          benefits={content.benefits}
          onAdd={() =>
            openAddEditor("benefit")
          }
          onEdit={(benefit) =>
            openEditEditor(
              "benefit",
              benefit
            )
          }
          onDelete={(benefit) =>
            openDeleteDialog(
              "benefit",
              benefit
            )
          }
        />

        <TestimonialsSection
          clientMode
          testimonials={
            content.testimonials
          }
          onAdd={() =>
            openAddEditor(
              "testimonial"
            )
          }
          onEdit={(testimonial) =>
            openEditEditor(
              "testimonial",
              testimonial
            )
          }
          onDelete={(testimonial) =>
            openDeleteDialog(
              "testimonial",
              testimonial
            )
          }
        />
      </main>

      <div className="client-footer-wrapper">
        <button
          type="button"
          className="client-footer-edit"
          onClick={() =>
            openEditEditor(
              "footer",
              content.settings
            )
          }
          title="Edit footer"
          aria-label="Edit footer"
        >
          <Pencil size={17} />
        </button>

        <Footer footerData={footerData} />
      </div>

      {editor && (
        <ClientEditorModal
          editor={editor}
          saving={saving}
          uploading={uploading}
          errorMessage={errorMessage}
          onClose={closeEditor}
          onSave={handleSave}
          onUpload={handleImageUpload}
        />
      )}

      {deleteTarget && (
        <div
          className="client-editor-overlay"
          onClick={closeDeleteDialog}
        >
          <div
            className="client-delete-dialog"
            onClick={(event) =>
              event.stopPropagation()
            }
          >
            <Trash2 size={30} />

            <h2>Delete this content?</h2>

            <p>
              This content will be permanently
              removed from the website.
            </p>

            {errorMessage && (
              <div className="client-editor-error">
                {errorMessage}
              </div>
            )}

            <div>
              <button
                type="button"
                onClick={
                  closeDeleteDialog
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