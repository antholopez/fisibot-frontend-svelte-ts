<script lang="ts">
  import Loading from "./../../components/Loading.svelte";
  import { onMount } from "svelte";
  import Header from "./../../components/Header.svelte";
  import { authStore, courseStore } from "./../../state/store";
  import type { IAuthUser } from "./../../interfaces/auth.interface";
  import type { ISession } from "./../../interfaces/session.interface";
  import type { ICourse } from "./../../interfaces/course.interface";
  import type { ITopic } from "./../../interfaces/topic.interface";
  import type {
    IQuestionAnswer,
    IQuestionAnswerList,
  } from "./../../interfaces/questionAnswer.interface";
  import ModalCreateQuestionAnswer from "./../../components/modals/CreateQuestionAnswer.svelte";
  import {
    getSessionsByCourse,
    getTopicsBySession,
    getQuestionsByTopic,
  } from "./../../api/course";
  import { link, pop } from "svelte-spa-router";

  export let params: any = {};

  let open = false;
  const toggle = () => (open = !open);

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
  let session: ISession = {
    number: null,
    description: null,
    courseId: Number(params.id),
  };
  let topic: ITopic = {
    name: null,
    description: null,
    idCourse: Number(params.id),
    idSession: Number(params.id2),
  };
  let topics: ITopic[] = [];
  let questionAnswer: IQuestionAnswer = {
    question: null,
    answer: null,
    idTopic: Number(params.id3),
  };
  let questionsAnswers: IQuestionAnswerList[] = [];

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
      topic = data2.find((t) => t.id === Number(params.id3));
      const data3 = await getQuestionsByTopic(topic.id);
      console.log("data questions: ", data3);
      questionsAnswers = data3;
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
    <h4 class="text-center text-uppercase mt-2">{topic.name}</h4>
    <div class="row mt-4">
      <h2>
        <span>Preguntas</span>
        <button class="btn btn-dark btn-circle" on:click={toggle}>+</button>
      </h2>
      <div class="accordion accordion-flush" id="accordionFlushExample">
        {#each questionsAnswers as questionAnswer, index}
          <div class="accordion-item">
            <h2 class="accordion-header" id="flush-heading{index + 1}">
              <button
                class="accordion-button collapsed"
                type="button"
                data-bs-toggle="collapse"
                data-bs-target="#flush-collapse{index + 1}"
                aria-expanded="false"
                aria-controls="flush-collapse{index + 1}"
              >
                {questionAnswer.question}
              </button>
            </h2>
            <div
              id="flush-collapse{index + 1}"
              class="accordion-collapse collapse"
              aria-labelledby="flush-heading{index + 1}"
              data-bs-parent="#accordionFlushExample"
            >
              {#each questionAnswer.answer as answer}
                <div class="accordion-body">
                  {answer.answer}
                </div>
              {/each}
            </div>
          </div>
        {/each}
      </div>
    </div>
  </div>
{/if}
<ModalCreateQuestionAnswer
  bind:open
  {toggle}
  bind:questionAnswer
  bind:questionsAnswers
/>

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
