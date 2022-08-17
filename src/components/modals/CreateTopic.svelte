<script lang="ts">
  import type { ITopic } from "./../../interfaces/topic.interface";
  import { Modal, ModalBody, ModalHeader } from "sveltestrap";
  import { notify } from "./../../utils/notification";
  import { createTopic } from "./../../api/course";

  export let open: boolean;
  export let toggle: () => boolean;
  export let topic: ITopic
  export let topics: ITopic[] = [];

  let loadingForm = false;
  let disabledForm = true;

  $: topic.name ? (disabledForm = false) : (disabledForm = true);

  const createNewTopic = async () => {
    loadingForm = true;

    try {
      topic.description = topic.name
      console.log('topic', topic);
      const newTopic = await createTopic(topic);
      closeModal();
      notify("success", "Se agregó el tema correctamente");

      topics = [...topics, newTopic];
    } catch (error) {
      console.log("error", error);
      open = !open;
    }
    disabledForm = false;
    loadingForm = false;
  };

  const clearTopic = () => {
    topic.name = '';

    disabledForm = true;
  };

  const closeModal = () => {
    clearTopic();
    open = false;
  };
</script>

<Modal
  isOpen={open}
  backdrop="static"
  {toggle}
  size="sm"
  class="modal-dialog modal-dialog-centered"
  on:close={closeModal}
>
  <ModalHeader {toggle}>Crear un tema</ModalHeader>
  <ModalBody>
    <form on:submit|preventDefault={createNewTopic}>
      <div class="form-floating mb-3">
        <input
          type="text"
          class="form-control"
          id="floatingInput"
          placeholder="name@example.com"
          bind:value={topic.name}
        />
        <label for="floatingInput">Nombre</label>
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
