import Swal from "sweetalert2";

export const showSuccess = (message) => {
    Swal.fire({
        icon: 'success',
        title: 'Success!',
        text: message,
        timer: 2000,
        showConfirmButton: false
    });
};

export const showError = (message) => {
    Swal.fire({
        icon: 'error',
        title: 'Error',
        text: message
    });
};

export const confirmDelete = async () => {
    return await Swal.fire({
        title: 'Are you sure?',
        text: "You won't be able to revert this!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Yes, delete it!',
        confirmButtonColor: '#d33'
    });
};