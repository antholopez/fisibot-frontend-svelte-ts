<script lang="ts">
  import type { IQuestionAnswer, IQuestionAnswerList } from "./../../interfaces/questionAnswer.interface";
  import { Modal, ModalBody, ModalHeader } from "sveltestrap";
  import { notify } from "./../../utils/notification";
  import { createTopic, createQuestion } from "./../../api/course";

  export let open: boolean;
  export let toggle: () => boolean;
  export let questionAnswer: IQuestionAnswer;
  export let questionsAnswers: IQuestionAnswerList[] = [];

  let loadingForm = false;
  let disabledForm = true;

  $: questionAnswer.question && questionAnswer.answer ? (disabledForm = false) : (disabledForm = true);

  const createNewQuestion = async () => {
    loadingForm = true;

    try {
      console.log('questionAnswer', questionAnswer);
      const newQuestion = await createQuestion(questionAnswer);
      closeModal();
      notify("success", "Se agregó la pregunta correctamente");

      questionsAnswers = [...questionsAnswers, newQuestion];
    } catch (error) {
      console.log("error", error);
      open = !open;
    }
    disabledForm = false;
    loadingForm = false;
  };

  const clearQuestion = () => {
    questionAnswer.question = '';
    questionAnswer.answer = '';

    disabledForm = true;
  };

  const closeModal = () => {
    clearQuestion();
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
  <ModalHeader {toggle}>Crear Pregunta</ModalHeader>
  <ModalBody>
    <form on:submit|preventDefault={createNewQuestion}>
      <div class="form-floating mb-3">
        <input
          type="text"
          class="form-control"
          id="floatingInput"
          placeholder="name@example.com"
          bind:value={questionAnswer.question}
        />
        <label for="floatingInput">Pregunta</label>
      </div>
      <div class="form-floating">
        <textarea class="form-control" placeholder="Leave a comment here" id="floatingTextarea2" style="height: 250px" bind:value={questionAnswer.answer}></textarea>
        <label for="floatingTextarea2">Respuesta</label>
      </div>
      <div class="d-grid gap-2 d-md-flex justify-content-md-end mt-2">
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
