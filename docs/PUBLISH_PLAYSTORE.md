# Publicar Cortes Aluminio en Google Play Store

Guia paso a paso para publicar la app usando Expo EAS.

---

## Requisitos previos

- [ ] **Cuenta de Google Play Developer** — $25 USD (pago unico): https://play.google.com/console
  - La verificacion de cuenta puede tardar 24-48 horas
- [ ] **Cuenta de Expo** — gratis: https://expo.dev/signup
- [ ] **Node.js** instalado (ya lo tienes)

---

## Paso 1: Instalar EAS CLI

```bash
npm install -g eas-cli
```

## Paso 2: Login en Expo

```bash
eas login
```

Usa tu cuenta de Expo. Si no tienes una, creala en https://expo.dev/signup

## Paso 3: Configurar el package name de Android

Editar `app.json` y agregar el `package` dentro de `android`:

```json
"android": {
  "package": "com.jhta.cortesaluminio",
  "adaptiveIcon": {
    ...
  }
}
```

> El package name debe ser unico en Play Store. Formato: `com.tunombre.tuapp`

## Paso 4: Configurar EAS Build

```bash
cd /Users/jeisonhiguita/Documents/side-projects/cortes-aluminio
eas build:configure
```

Esto crea un archivo `eas.json` con los perfiles de build (development, preview, production).

## Paso 5: Crear el build de produccion

```bash
eas build --platform android --profile production
```

- Se ejecuta en la nube (no necesitas Android Studio)
- Tarda ~10-15 minutos la primera vez
- Genera un archivo `.aab` (Android App Bundle)
- EAS te pedira crear un keystore la primera vez — acepta, lo guarda en la nube

Al terminar te da un link para descargar el `.aab`.

## Paso 6: Crear la app en Google Play Console

1. Ir a https://play.google.com/console
2. Click **"Crear aplicacion"**
3. Llenar:
   - Nombre: **Cortes Aluminio**
   - Idioma: Espanol
   - Tipo: Aplicacion
   - Gratuita
4. Aceptar las declaraciones

## Paso 7: Completar la ficha de Play Store

Antes de publicar, Google requiere completar:

### Informacion basica
- **Descripcion corta**: "Calculadora de cortes de aluminio para ventanas"
- **Descripcion larga**: "Calcula las medidas exactas de cada pieza de aluminio para construir ventanas. Soporta sistemas 520 y 744. Ingresa ancho, alto y numero de alas para obtener las dimensiones de cabezal, sillar, jamba, horizontal, enganche, traslape y vidrio."

### Capturas de pantalla
- Necesitas minimo 2 capturas de pantalla del telefono
- Puedes tomarlas del emulador o tu celular
- Formato: JPEG o PNG, minimo 320px, maximo 3840px

### Icono de la app
- 512 x 512 px, PNG de alta resolucion

### Clasificacion de contenido
- Ir a **Politica > Clasificacion de contenido**
- Completar el cuestionario (es rapido, la app no tiene contenido sensible)

### Politica de privacidad
- Google requiere una URL de politica de privacidad
- Opcion rapida: crear una pagina simple en GitHub Pages o usar un generador como https://app-privacy-policy-generator.firebaseapp.com/
- Como la app no recopila datos, la politica es muy simple

## Paso 8: Subir el build

### Opcion A: Con EAS Submit (automatico)

Primero necesitas crear una **Service Account Key** de Google:

1. En Play Console: **Configuracion > Acceso a API**
2. Crear una cuenta de servicio
3. Descargar el archivo JSON
4. Guardar el JSON en un lugar seguro (NO en el repo)

Luego:

```bash
eas submit --platform android --path /ruta/al/archivo.aab
```

O si el build ya esta en EAS:

```bash
eas submit --platform android --latest
```

Te pedira la ruta al JSON de la service account.

### Opcion B: Manual (mas simple la primera vez)

1. Descargar el `.aab` del link que te dio `eas build`
2. En Play Console, ir a **Produccion > Crear nueva version**
3. Subir el `.aab` manualmente
4. Agregar notas de la version: "Version inicial"
5. Click **Revisar version** y luego **Iniciar lanzamiento**

## Paso 9: Publicar

### Recomendacion: empezar con testing interno

1. En Play Console: **Pruebas > Pruebas internas**
2. Subir el `.aab`
3. Agregar emails de testers (hasta 100)
4. Los testers reciben un link para instalar
5. Disponible en minutos (sin revision de Google)

### Produccion

1. Cuando estes listo, promueve de testing interno a produccion
2. Google revisa la app (puede tardar 1-7 dias la primera vez)
3. Una vez aprobada, aparece en Play Store

---

## Actualizaciones futuras

Para publicar una nueva version:

1. Incrementar `version` en `app.json` (ej: "1.0.0" -> "1.1.0")
2. Crear nuevo build:
   ```bash
   eas build --platform android --profile production
   ```
3. Subir:
   ```bash
   eas submit --platform android --latest
   ```

---

## Checklist final

- [ ] Cuenta Google Play Developer activa
- [ ] Cuenta Expo creada y logueada
- [ ] `android.package` configurado en `app.json`
- [ ] `eas build:configure` ejecutado
- [ ] Build de produccion creado con `eas build`
- [ ] App creada en Play Console
- [ ] Descripcion, capturas, icono subidos
- [ ] Clasificacion de contenido completada
- [ ] Politica de privacidad publicada y URL agregada
- [ ] `.aab` subido a Play Console
- [ ] Version enviada a revision
