<template>
  <div class="favorites-empty">
    <i class="pi pi-info-circle" />
    <p>Nenhum favorito adicionado</p>
    <p>
      Para adicionar alguém aos seus favoritos, clique no usuário na tabela do ranking ou nas suas apostas nos jogos e
      ative a estrela no topo das estatísticas.
    </p>
  </div>
</template>
<script setup lang="ts"></script>
<style lang="scss" scoped>
.favorites-empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: var(--xxl-spacing);
  color: var(--bolao-c-grey1-t2);
  text-align: center;

  i {
    margin-bottom: var(--m-spacing);
    font-size: 4rem;
  }

  p {
    max-width: 400px;
    margin: var(--xs-spacing) 0;
    font-size: var(--s-font-size);
  }
}
</style>
