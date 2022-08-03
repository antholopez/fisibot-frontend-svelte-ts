<script lang="ts">
  import { getCourse } from "./../../api/course";
  import Loading from "./../../components/Loading.svelte";
  import { onMount } from "svelte";
  import Header from "./../../components/Header.svelte";
  import { authStore } from "./../../state/store";
  import type { ICourse } from "./../../interfaces/course.interface";
  import type { IAuthUser } from "./../../interfaces/auth.interface";

  export let params: any = {};

  let loading = false;
  let userSession: IAuthUser;
  let course: ICourse = {
    name: null,
    description: null,
    image: null,
    academicSemester: null,
    cycle: null,
    group: null,
    idSchool: null,
  };

  onMount(async () => {
    const id = Number(params.id);
    userSession = authStore.getUserSession();
    if (userSession) {
      loading = true;
      course = await getCourse(id);
      loading = false;
    }
  });
</script>

<Header />
{#if loading}
  <Loading />
{:else}
  <div class="container mt-4 text-center">
    <img src={course.image} class="img-fluid" alt="...">
    <h2 class="text-uppercase mt-2">{course.name}</h2>
  </div>
{/if}

<style>
</style>
