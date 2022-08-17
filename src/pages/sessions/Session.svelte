<script lang="ts">
  import Loading from "./../../components/Loading.svelte";
  import { onMount } from "svelte";
  import Header from "./../../components/Header.svelte";
  import { authStore, courseStore } from "./../../state/store";
  import type { IAuthUser } from "./../../interfaces/auth.interface";
  import type { ISession } from "./../../interfaces/session.interface";
  import type { ICourse } from "./../../interfaces/course.interface";
  import type { ITopic } from "./../../interfaces/topic.interface";
  import ModalCreateTopic from "./../../components/modals/CreateTopic.svelte";
  import { getSessionsByCourse, getTopicsBySession } from "./../../api/course";
  import { link, pop } from "svelte-spa-router";

  export let params: any = {};

  let open = false;
  const toggle = () => (open = !open);

  let loading = false;
  let userSession: IAuthUser;

  let session: ISession = {
    number: null,
    description: null,
    courseId: Number(params.id),
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
  let topic: ITopic = {
    name: null,
    description: null,
    idCourse: Number(params.id),
    idSession: Number(params.id2),
  };
  let topics: ITopic[] = [];

  onMount(async () => {
    const id = Number(params.id);
    const id2 = Number(params.id2);
    userSession = authStore.getUserSession();
    if (userSession) {
      loading = true;
      course = await courseStore.getOneCourse(id);
      const data = await getSessionsByCourse(id);
      session = data.find((s) => s.id === Number(params.id2));
      const data2 = await getTopicsBySession(id, id2);
      topics = data2;
      loading = false;
    }
  });
</script>

<Header />
{#if loading}
  <Loading />
{:else}
  <div class="container">
    <div class="text-center">
      <button
        type="button"
        class="text-center btn btn-link"
        on:click={() => pop()}>Regresar</button
      >
    </div>
    <h2 class="text-center text-uppercase mt-2">{course.name}</h2>
    <h3 class="text-center text-uppercase mt-2">{session.description}</h3>
    <div class="row mt-4">
      <h2>
        <span>Temas</span>
        <button class="btn btn-dark btn-circle" on:click={toggle}
          >+</button
        >
      </h2>
      <div class="row mt-4">
        {#each topics as topic}
          <div class="col-sm-2 mt-4">
            <div class="card" style="width: 12rem;">
              <div class="card-body text-center">
                <h5 class="card-title">{topic.name}</h5>
                <a
                  href="/courses/{course.id}/sessions/{session.id}/topics/{topic.id}" use:link
                  class="btn btn-primary"
                  >Ingresar</a
                >
              </div>
            </div>
          </div>
        {/each}
      </div>
    </div>
  </div>
{/if}
<ModalCreateTopic bind:open {toggle} bind:topic bind:topics />

<style>
  .btn-circle {
    width: 30px;
    height: 30px;
    padding: 6px 0px;
    border-radius: 15px;
    text-align: center;
    font-size: 12px;
    line-height: 1.42857;
}
</style>