<script lang="ts">
  import { onMount } from "svelte";
  import { link } from "svelte-spa-router";
  import chatbotHome from "./../assets/chatbot-telegram.png";
  import { getCourses } from "./../api/course";
  import { getSchools } from "./../api/school";
  import Loading from "./../components/Loading.svelte";
  import Header from "./../components/Header.svelte";
  import ModalCreateCourse from "./../components/modals/CreateCourse.svelte";
  import {
    authStore,
  } from "./../state/store";
  import type { ICourse } from "./../interfaces/course.interface";
  import type { ISchool } from "./../interfaces/school.interface";

  let open = false;
  const toggle = () => (open = !open);

  let loading = false;
  let userSession = null;
  let courses = [];
  let textSearch = "";
  let filteredCourses = [];
  let schools: ISchool[] = [];

  onMount(async () => {
    userSession = authStore.getUserSession();
    console.log("userSession Home", userSession);
    if (userSession) {
      loading = true;
      const data = await getCourses();
      schools = await getSchools();
      courses = data;
      filteredCourses = data;
      loading = false;
    }
  });

  let course: ICourse = {
    name: null,
    description: null,
    image: null,
    academicSemester: null,
    cycle: null,
    group: null,
    idSchool: null,
  };

  $: if (filteredCourses.length && !courses.length) courses = filteredCourses;

  const searchCourses = (event) => {
    const value = event.target.value;
    filteredCourses = courses.filter((course) =>
      course.name.toLowerCase().includes(value)
    );
  };

  
</script>

<Header />
{#if loading}
  <Loading />
{:else if !userSession}
  <div class="container col-xxl-8 px-4 py-5">
    <div class="row flex-lg-row-reverse align-items-center g-5 py-5">
      <div class="col-10 col-sm-8 col-lg-6">
        <img
          src={chatbotHome}
          class="d-block mx-lg-auto img-fluid rounded"
          alt="Bootstrap Themes"
          width="1000"
          height="1000"
          loading="lazy"
        />
      </div>
      <div class="col-lg-6">
        <h1 class="display-5 fw-bold lh-1 mb-3">
          Sistema gestor de Chatbot y Cursos
        </h1>
        <p class="lead">
          Sistema web educativo destinado como soporte tecnológico para el
          profesor(a) en gestionar su material didáctico como archivos Words,
          PDFs, Power Points, etc. de su(s) curso(s) segun el semestre académico
          y gestionar el conocimiento o información educativa a su asistente
          virtual.
        </p>
        <div class="d-grid gap-2 d-md-flex justify-content-md-start">
          <a href="/login" class="btn btn-primary btn-lg px-4 me-md-2" use:link
            >Ingresar</a
          >
        </div>
      </div>
    </div>
  </div>
{:else if !courses.length && userSession}
  <div class="container mt-5">
    <div>
      <h1 class="text-center">
        Hola {userSession.firstName}
        {userSession.lastName}
      </h1>
      <div class="lead text-center center-paragraph">
        <p>
          Puedes crear una clase para subir tu material didáctico y publicar
          anuncios para los alumnos.
        </p>
        <button class="btn btn-dark me-md-2" on:click={toggle}
          >Crear curso</button
        >
      </div>
    </div>
  </div>
{:else if courses.length && userSession}
  <div class="container">
    <div class="row g3 mt-4 mb-2">
      <div class="col-sm-8">
        <input
          type="text"
          class="form-control text-dark rounded-0"
          bind:value={textSearch}
          on:keyup={searchCourses}
          placeholder="Escriba el curso que desea buscar"
        />
      </div>
      <div class="col-4 d-md-flex justify-content-md-end">
        <button class="btn btn-dark me-md-2" on:click={toggle}
          >Crear curso</button
        >
      </div>
    </div>
    <div class="row row-cols-1 row-cols-md-3 g-4 mt-0 mb-5">
      {#each filteredCourses as course}
        <div class="col">
          <div class="card h-100">
            <a href="/courses/{course.id}" use:link>
              <img
                src={course.image}
                class="card-img-top"
                alt="..."
                loading="lazy"
              />
            </a>
            <div class="card-body">
              <a class="set-href" href="/courses/{course.id}" use:link>
                <h5 class="card-title text-uppercase">{course.name}</h5>
              </a>
              <p class="card-text">
                {course.academicSemester} - G{course.group} - {course.school
                  .name} - {course.cycle} Ciclo
              </p>
            </div>
          </div>
        </div>
      {/each}
    </div>
  </div>
{/if}
<ModalCreateCourse
  bind:open={open}
  toggle={toggle}
  bind:course={course}
  schools={schools}
  bind:filteredCourses={filteredCourses}
/>

<style>
  .set-href {
    text-decoration: none;
    color: inherit;
  }

  .center-paragraph {
    padding-left: 300px;
    padding-right: 300px;
  }
</style>
