import Swal from "sweetalert2";

export const showErrorAlert = (message: string) => {
  Swal.fire({
    title: "Error!",
    text: message,
    icon: "error",
    confirmButtonText: '<p class="px-8"></p> OK',
    confirmButtonColor: "#ff5363",
  });
};

export const showSuccessAlert = (
  message: string,
  navigateToPage?: () => void,
  onConfirm?: () => void,
  footerHtml?: string,
  footerLinkId: string = "footerLink"
) => {
  Swal.fire({
    title: "Success!",
    text: message,
    icon: "success",
    confirmButtonText: '<p class="px-8"></p> OK',
    confirmButtonColor: "#ff5363",
    footer: footerHtml || "",
    didOpen: () => {
      const link = document.getElementById(footerLinkId);
      if (link && navigateToPage) {
        link.addEventListener("click", (e) => {
          e.preventDefault();
          Swal.close();
          navigateToPage();
        });
      }
    },
    didClose: () => {
      if (onConfirm) {
        onConfirm();
      }
    },
  });
};
