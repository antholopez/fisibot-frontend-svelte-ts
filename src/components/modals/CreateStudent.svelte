<script lang="ts">
  import type { IStudent } from "./../../interfaces/student.interface";
  import { Modal, ModalBody, ModalHeader } from "sveltestrap";
  import { notify } from "./../../utils/notification";
  import { createStudent } from "./../../api/student";

  export let open: boolean;
  export let toggle: () => boolean;
  export let student: IStudent;
  export let filteredStudents: IStudent[] = [];

  let loadingForm = false;
  let disabledForm = true;

  $: student.code && student.email && student.firstName && student.lastName
    ? (disabledForm = false)
    : (disabledForm = true);

  const createNewStudent = async () => {
    loadingForm = true;

    try {
      student.image = `https://ui-avatars.com/api/?name=${
        student.firstName.split(" ")[0]
      } ${student.lastName.split(" ")[0]}&background=random&rounded=true`;
      const newStudent = await createStudent(student);
      closeModal();
      notify("success", "Se agregó el estudiante correctamente");

      filteredStudents = [...filteredStudents, newStudent];
    } catch (error) {
      console.log("error", error);
      open = !open;
    }
    disabledForm = false;
    loadingForm = false;
  };

  const clearCourse = () => {
    student.code = null;
    student.email = null;
    student.firstName = null;
    student.lastName = null;
    student.image = null;

    disabledForm = true;
  };

  const closeModal = () => {
    clearCourse();
    open = false;
  };
</script>

<Modal
  isOpen={open}
  backdrop="static"
  {toggle}
  class="modal-dialog modal-dialog-centered"
  on:close={closeModal}
>
  <ModalHeader {toggle}>Agregar Estudiante</ModalHeader>
  <ModalBody>
    <form on:submit|preventDefault={createNewStudent}>
      <div class="form-floating mb-3">
        <input
          type="text"
          class="form-control"
          id="floatingInput"
          placeholder="name@example.com"
          bind:value={student.code}
        />
        <label for="floatingInput">Código</label>
      </div>
      <div class="form-floating mb-3">
        <input
          type="email"
          class="form-control"
          id="floatingInput"
          placeholder="name@example.com"
          bind:value={student.email}
        />
        <label for="floatingInput">Correo</label>
      </div>
      <div class="form-floating mb-3">
        <input
          type="text"
          class="form-control"
          id="floatingInput"
          placeholder="name@example.com"
          bind:value={student.firstName}
        />
        <label for="floatingInput">Nombres</label>
      </div>
      <div class="form-floating mb-3">
        <input
          type="text"
          class="form-control"
          id="floatingInput"
          placeholder="name@example.com"
          bind:value={student.lastName}
        />
        <label for="floatingInput">Apellidos</label>
      </div>
      <div class="d-grid gap-2 d-md-flex justify-content-md-end">
        <button
          type="button"
          class="btn btn-outline-secondary"
          data-bs-dismiss="modal"
          disabled={loadingForm}
          on:click={closeModal}>Cancelar</button
        >
        <button type="submit" class="btn btn-success" disabled={disabledForm}
          >{#if !loadingForm}Agregar{:else}Agregando...{/if}</button
        >
      </div>
    </form>
  </ModalBody>
</Modal>
