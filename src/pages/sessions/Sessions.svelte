<script lang="ts">
  import Loading from "./../../components/Loading.svelte";
  import { onMount } from "svelte";
  import Header from "./../../components/Header.svelte";
  import { authStore, courseStore } from "./../../state/store";
  import type { IAuthUser } from "./../../interfaces/auth.interface";
  import type { ISession } from "./../../interfaces/session.interface";
  import type { ICourse } from "./../../interfaces/course.interface";
  import ModalCreateSession from "./../../components/modals/CreateSession.svelte";
  import { getSessionsByCourse } from "./../../api/course";

  export let params: any = {};

  let open = false;
  const toggle = () => (open = !open);

  let loading = false;
  let userSession: IAuthUser;
  
  let session: ISession = {
    number: null,
    description: null,
    courseId: Number(params.id)
  };
  let course: ICourse = {
    name: null,
    description: null,
    image: null,
    academicSemester: null,
    cycle: null,
    group: null,
    idSchool: null,
  };
  let sessions: ISession[] = [];

  onMount(async () => {
    const id = Number(params.id);
    userSession = authStore.getUserSession();
    course = courseStore.getOneCourse(id);
    console.log('sessions', sessions);
    if (userSession) {
      const data = await getSessionsByCourse(id);
      console.log("data sessions", data);
      sessions = data;
      loading = true;
      loading = false;
    }
  });
</script>

<Header />
{#if loading}
  <Loading />
{:else}
  <div class="container">
    <h1 class="text-center text-uppercase mt-2">{course.name}</h1>
    <div class="text-center">
      <button class="btn btn-dark me-md-2 mt-2" on:click={toggle}
        >Crear Semana</button
      >
    </div>
    <div class="row mt-4">
      {#each sessions as session}
        <div class="col-sm-2 mt-4">
          <div class="card" style="width: 12rem;">
            <div class="card-body text-center">
              <h5 class="card-title">{session.description}</h5>
              <a href="#" class="btn btn-primary">Ingresar</a>
            </div>
          </div>
        </div>
      {/each}
    </div>
  </div>
{/if}
<ModalCreateSession bind:open {toggle} bind:session bind:sessions/>

<style>
</style>
