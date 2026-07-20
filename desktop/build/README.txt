Para usar el logo de ROANSA como icono de la app:
1. Pon aqui un archivo icon.png de 1024x1024 px (fondo transparente o solido).
2. En desktop/package.json, dentro de "build", agrega: "icon": "build/icon.png"
   (puedes ponerlo una sola vez a nivel raiz de "build", aplica a win y mac).
3. Vuelve a correr el workflow de GitHub Actions.

Si no agregas un icono, la app se genera igual pero con el icono por defecto de Electron.
