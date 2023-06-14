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
  navigateToPet: () => void
) => {
  Swal.fire({
    title: "Success!",
    text: message,
    icon: "success",
    confirmButtonText: '<p class="px-8"></p> OK',
    confirmButtonColor: "#ff5363",
    footer: '<a href id="navigatePet">View the pet\'s profile page</a>',
    didOpen: () => {
      const link = document.getElementById("navigatePet");
      if (link) {
        link.addEventListener("click", (e) => {
          e.preventDefault();
          Swal.close();
          navigateToPet();
        });
      }
    },
  });
};
