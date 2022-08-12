<script lang="ts">
  import type { ISession } from "./../../interfaces/session.interface";
  import { Modal, ModalBody, ModalHeader } from "sveltestrap";
  import { notify } from "./../../utils/notification";
  import { createStudent } from "./../../api/student";
  import { createSession } from "./../../api/course";

  export let open: boolean;
  export let toggle: () => boolean;
  export let session: ISession;
  export let sessions: ISession[] = [];

  let loadingForm = false;
  let disabledForm = true;

  $: session.number !== defaultSessionNumber
    ? (disabledForm = false)
    : (disabledForm = true);

  const defaultSessionNumber = "Seleeciona un número";
  session.number = defaultSessionNumber;

  const createNewSession = async () => {
    loadingForm = true;

    try {
      session.number = Number(session.number);
      session.description = "Semana " + session.number;
      const newSession = await createSession(session);
      closeModal();
      notify("success", "Se agregó la sesión correctamente");

      sessions = [...sessions, newSession];
    } catch (error) {
      console.log("error", error);
      open = !open;
    }
    disabledForm = false;
    loadingForm = false;
  };

  const clearSession = () => {
    session.number = defaultSessionNumber;

    disabledForm = true;
  };

  const closeModal = () => {
    clearSession();
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
  <ModalHeader {toggle}>Añadir una semana</ModalHeader>
  <ModalBody>
    <form on:submit|preventDefault={createNewSession}>
      <div class="form-floating mb-3">
        <select
          class="form-select"
          id="floatingSelect"
          aria-label="Floating label select example"
          bind:value={session.number}
        >
          <option selected>{defaultSessionNumber}</option>
          <option value="1">1</option>
          <option value="2">2</option>
          <option value="3">3</option>
          <option value="4">4</option>
          <option value="5">5</option>
          <option value="6">6</option>
          <option value="7">7</option>
          <option value="8">8</option>
          <option value="9">9</option>
          <option value="10">10</option>
          <option value="11">11</option>
          <option value="12">12</option>
          <option value="13">13</option>
          <option value="14">14</option>
          <option value="15">15</option>
          <option value="16">16</option>
          <option value="17">17</option>
          <option value="18">18</option>
          <option value="19">19</option>
          <option value="20">20</option>
        </select>
        <label for="floatingInput">Número de semana</label>
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
