<script lang="ts">
  import Header from "./../../components/Header.svelte";
  import Loading from "./../../components/Loading.svelte";
  import { getStudentsByCourse } from "./../../api/student";
  import { onMount } from "svelte";
  import { authStore, courseStore } from "./../../state/store.js";
  import type { IAuthUser } from "./../../interfaces/auth.interface";
  import type { IStudent } from "./../../interfaces/student.interface";
  import type { ICourse } from "./../../interfaces/course.interface";
  import ModalCreateStudent from "./../../components/modals/CreateStudent.svelte";

  export let params: any = {};

  let open = false;
  const toggle = () => (open = !open);

  let loading = false;
  let userSession: IAuthUser = null;
  let course: ICourse = {
    name: null,
    description: null,
    image: null,
    academicSemester: null,
    cycle: null,
    group: null,
    idSchool: null,
  };
  let students: IStudent[] = [];
  let filteredStudents: IStudent[] = [];
  let textSearch = "";
  let textNotStudent = "No hay estudiantes matriculados.";

  onMount(async () => {
    const id = Number(params.id);
    userSession = authStore.getUserSession();
    course = courseStore.getOneCourse(id);
    console.log('course', course);
    if (userSession) {
      loading = true;
      const data = await getStudentsByCourse(id);
      console.log("data students", data);
      students = data;
      filteredStudents = data;
      loading = false;
    }
  });

  let student: IStudent = {
    code: null,
    email: null,
    firstName: null,
    lastName: null,
    image: null,
    courseId: Number(params.id),
  };

  $: if (filteredStudents.length && !students.length)
    students = filteredStudents;

  const searchStudent = (e: any) => {
    const value = e.target.value;
    filteredStudents = students.filter(
      (student) =>
        student.code.includes(value) ||
        student.firstName.toLowerCase().includes(value) ||
        student.lastName.toLowerCase().includes(value)
    );

    if (!filteredStudents.length)
      textNotStudent = "No se obtuvieron resultados.";
  };
</script>

<Header />
{#if loading}
  <Loading />
{:else}
  <div class="container">
    <h1 class="text-center text-uppercase mt-2">{course.name}</h1>
    <div class="row g3 mt-4 mb-2">
      <div class="col-sm-8">
        <input
          type="text"
          class="form-control text-dark rounded-0"
          bind:value={textSearch}
          on:keyup={searchStudent}
          placeholder="Buscar por código,nombre(s) o apellido(s)"
        />
      </div>
      <div class="col-4 d-md-flex justify-content-md-end">
        <button class="btn btn-dark me-md-2" on:click={toggle}
          >Agregar Estudiante</button
        >
      </div>
    </div>

    <table class="table table-striped table-dark table-hover mt-4">
      <thead>
        <tr>
          <th scope="col">#</th>
          <th scope="col">Código</th>
          <th scope="col">Email</th>
          <th scope="col">Nombres</th>
          <th scope="col">Apellidos</th>
          <th scope="col">Imagen</th>
          <th scope="col" />
        </tr>
      </thead>
      <tbody>
        {#each filteredStudents as student, i}
          <tr>
            <th scope="row">{i + 1}</th>
            <td>{student.code}</td>
            <td>{student.email}</td>
            <td>{student.firstName}</td>
            <td>{student.lastName}</td>
            <td>
              <img
                src={student.image}
                class="img-fluid text-center image-student"
                alt={student.firstName}
              />
            </td>
            <td class="text-center">
              <button class="btn btn-success">Editar</button>
              <button class="btn btn-danger">Eliminar</button>
            </td>
          </tr>
        {/each}
        {#if !filteredStudents.length}
          <tr>
            <td colspan="7" class="text-center">{textNotStudent}</td>
          </tr>
        {/if}
      </tbody>
    </table>
  </div>
  <ModalCreateStudent bind:open {toggle} bind:student bind:filteredStudents />
{/if}

<style>
  .image-student {
    width: 38px;
    height: 38px;
  }
</style>
