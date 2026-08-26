// asi se configura vite para poder importar
//  archivos de otro tipo
// "configuracion de tipos"
/// <reference types="vite/client" />

declare module "*.css?raw" {
  const content: string;
  export default content;
}
