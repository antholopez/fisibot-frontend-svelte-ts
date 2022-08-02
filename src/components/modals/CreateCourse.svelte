<script lang="ts">
  import type { ICourse } from "./../../interfaces/course.interface";
  import { Modal, ModalBody, ModalHeader } from "sveltestrap";
  import type { ISchool } from "./../../interfaces/school.interface";
  import {
    academicSemesterStore,
    cycleStore,
    groupStore,
  } from "./../../state/store";
  import { createCourse } from "./../../api/course";
  import { notify } from "./../../utils/notification";

  export let open: boolean;
  export let toggle: () => boolean;
  export let course: ICourse;
  export let schools: ISchool[];
  export let filteredCourses: ICourse[];

  const groups = groupStore.get();
  const academicSemesters = academicSemesterStore.get();
  const cycles = cycleStore.get();
  const defaultImage =
    "https://inlogiq.com/wp-content/uploads/2021/06/blog-4.png";

  let loadingForm = false;
  let disabledForm = true;

  $: course.name &&
  course.group > 0 &&
  course.idSchool > 0 &&
  academicSemesters.filter((as) => as.name === course.academicSemester)
    .length &&
  cycles.filter((c) => c.name === course.cycle).length
    ? (disabledForm = false)
    : (disabledForm = true);

  const defaultAcademicSemester = "Selecciona un semestre";
  course.academicSemester = defaultAcademicSemester;
  const defaultCycle = "Selecciona un ciclo";
  course.cycle = defaultCycle;
  const defaultGroup = "Selecciona un grupo";
  course.group = defaultGroup;
  const defaultSchool = "Seleccion una escuela";
  course.idSchool = defaultSchool;

  const clearCourse = () => {
    course.name = null;
    course.description = null;
    course.image = null;
    course.academicSemester = defaultAcademicSemester;
    course.cycle = defaultCycle;
    course.group = defaultGroup;
    course.idSchool = defaultSchool;
  };

  const closeModal = () => {
    clearCourse();
    open = false;
  };

  const createNewCourse = async () => {
    loadingForm = true;

    try {
      course.description = course.name;
      course.image = defaultImage;
      const newCourse = await createCourse(course);
      closeModal();
      notify("success", "Creación del curso exitoso");

      filteredCourses = [...filteredCourses, newCourse];
    } catch (error) {
      console.log("error", error);
      open = !open;
    }

    disabledForm = false;
    loadingForm = false;
  };
</script>

<Modal
  isOpen={open}
  backdrop="static"
  {toggle}
  class="modal-dialog modal-dialog-centered"
  on:close={closeModal}
>
  <ModalHeader {toggle}>Crear clase</ModalHeader>
  <ModalBody>
    <form on:submit|preventDefault={createNewCourse}>
      <div class="form-floating mb-3">
        <input
          type="text"
          class="form-control"
          id="floatingInput"
          placeholder="name@example.com"
          bind:value={course.name}
        />
        <label for="floatingInput">Nombre del curso</label>
      </div>
      <div class="form-floating mb-3">
        <select
          class="form-select"
          id="floatingSelect"
          aria-label="Floating label select example"
          bind:value={course.academicSemester}
        >
          <option selected>{defaultAcademicSemester}</option>
          {#each academicSemesters as academicSemester}
            <option value={academicSemester.name}
              >{academicSemester.name}</option
            >
          {/each}
        </select>
        <label for="floatingPassword">Semestre académico</label>
      </div>
      <div class="form-floating mb-3">
        <select
          class="form-select"
          id="floatingSelect"
          aria-label="Floating label select example"
          bind:value={course.cycle}
        >
          <option selected>{defaultCycle}</option>
          {#each cycles as cycle}
            <option value={cycle.name}>{cycle.name}</option>
          {/each}
        </select>
        <label for="floatingPassword">Ciclo</label>
      </div>
      <div class="form-floating mb-3">
        <select
          class="form-select"
          id="floatingSelect"
          aria-label="Floating label select example"
          bind:value={course.group}
        >
          <option selected>{defaultGroup}</option>
          {#each groups as group}
            <option value={group.id}>{group.name}</option>
          {/each}
        </select>
        <label for="floatingPassword">Grupo</label>
      </div>
      <div class="form-floating mb-3">
        <select
          class="form-select"
          id="floatingSelect"
          aria-label="Floating label select example"
          bind:value={course.idSchool}
        >
          <option selected>{defaultSchool}</option>
          {#each schools as school}
            <option value={school.id}>{school.name}</option>
          {/each}
        </select>
        <label for="floatingPassword">Escuela</label>
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
          >{#if !loadingForm}Crear{:else}Creando...{/if}</button
        >
      </div>
    </form>
  </ModalBody>
</Modal>
