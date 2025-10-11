# Universidad Peruana de Ciencias Aplicadas  
## 1ASI0404 – Inteligencia Artificial  
**Sección:** 5215  
**Profesor:** Diego Rojas Sihuay  

---

# Trabajo Parcial

### Integrantes

| Apellidos, nombres | Código |
|--------------------|---------|
| Mendoza Quispe Carlos Fabian | U20231C416 |
| Ibarra Cabrera Camila Adriana | U202317287 | 
| Moncada Olivares Elías David | U202315959 | 
| Miranda Cardenas Sofia Gabriel | U20191C439 | 
| Olivera Alvarez Lizbeth Teresita | U201616851 | 
| Huapaya Vargas Daniel José | U202312230 | 
| Abanto Davila Alvaro Jair Moises | U202313540 | 
| Antonio Moran Jose David | U202223356 | 
| Toledo Mamani Wilber Franz | U202320608 | 
| Rojas Sánchez Patricia Lucía del Rosario | U202310474 | 

**Facultad de Ingeniería – 2025-2**

---

## Roles asignados para el proyecto

| Integrante | Rol (según el enunciado) | Tareas |
|-------------|---------------------------|--------|
| Abanto Dávila, Álvaro Jair Moisés | Scrum Master | Introducción y situación de contexto real |
| Antonio Morán, José David | UI/UX Designer | Introducción y situación de contexto real |
| Huapaya Vargas, Daniel José | Data Engineer | Introducción y situación de contexto real |
| Ibarra Cabrera, Camila Adriana | Data Scientist | Adquisición de datos |
| Mendoza Quispe, Carlos Fabián | Developer | Experimentos |
| Miranda Cárdenas, Sofía Gabriel | Data Scientist | Propuesta técnica |
| Moncada Olivares, Elías David | Data Engineer | Propuesta técnica |
| Olivera Álvarez, Lizbeth Teresita | Developer | Propuesta técnica |
| Rojas Sánchez, Patricia Lucía del Rosario | Data Engineer | Ingeniería de características |
| Toledo Mamani, Wilber Franz | QA Tester | Propuesta técnica |

---

## Introducción

El **Trastorno del Espectro Autista (TEA)** es una condición del neurodesarrollo que impacta la comunicación, la interacción social y el comportamiento. Según la **Organización Mundial de la Salud (OMS, 2025)**, se estima que **1 de cada 100 niños** en el mundo presenta TEA, lo que plantea un desafío significativo para la inclusión educativa y social. Las dificultades en la comunicación verbal y la comprensión de interacciones sociales son barreras importantes que estos niños enfrentan a diario.

Este proyecto se enfoca en el **diseño y desarrollo de un chatbot inclusivo**, una herramienta tecnológica de asistencia diseñada específicamente para niños con TEA. El objetivo principal es **facilitar la comunicación y el aprendizaje** a través de una interfaz amigable que utiliza pictogramas, opciones visuales y lenguaje sencillo.  Al crear un canal de comunicación adaptado a sus necesidades, buscamos **potenciar su autonomía, reducir la ansiedad social y contribuir al desarrollo de sus habilidades comunicativas**, promoviendo así su inclusión en diversos contextos.

---

## Descripción del contexto

El **Trastorno del Espectro Autista (TEA)** representa una realidad tangible en millones de hogares, escuelas y comunidades en todo el mundo. Más allá de la estadística de la OMS (2025) que indica que 1 de cada 127 niños vive con esta condición, existe un contexto diario de desafíos comunicativos que impacta profundamente su calidad de vida y su inclusión social. Un niño con TEA no solo tiene “dificultades para comunicarse”, sino que puede ser incapaz de expresar necesidades básicas como *“tengo hambre”* o *“algo me duele”*, lo que a menudo deriva en episodios de frustración y ansiedad que son mal interpretados como problemas de conducta.

En el entorno educativo, un maestro puede dar una instrucción simple como *“saquen su cuaderno y abran la página 20”*, pero para un niño con TEA, esta secuencia de dos pasos puede ser una barrera insuperable sin apoyo visual. Esta desconexión entre el lenguaje verbal y su procesamiento cognitivo puede llevar a retraso académico y a un sentimiento de aislamiento respecto a sus compañeros. En el ámbito social, la incapacidad para interpretar el lenguaje no verbal —como las expresiones faciales o el tono de voz— dificulta la creación de lazos de amistad, dejando a muchos niños al margen de las interacciones grupales.

Los padres y terapeutas emplean herramientas como los **Sistemas Aumentativos y Alternativos de Comunicación (SAAC)**, principalmente tarjetas físicas con pictogramas.  
Si bien son efectivos, estos sistemas son estáticos, limitados en vocabulario y poco prácticos para una comunicación fluida.  
El contexto real es, por tanto, una brecha persistente entre la necesidad del niño de comunicarse y las herramientas disponibles para hacerlo de manera efectiva, autónoma y adaptada al mundo digital en el que crece. Este proyecto nace de la necesidad de cerrar esa brecha.

---

## Fundamento de la solución

La tecnología ofrece una oportunidad única para crear entornos de comunicación adaptados a las necesidades de los niños con TEA. A diferencia de las interacciones humanas, que pueden ser impredecibles y abrumadoras, un chatbot bien diseñado ofrece un canal de comunicación predecible, paciente y libre de juicios. La solución propuesta consiste en un asistente conversacional que integra tres pilares fundamentales: lenguaje sencillo, para reducir la carga cognitiva; soporte pictográfico, utilizando el sistema ARASAAC para asociar conceptos con imágenes claras y consistentes; e interactividad guiada, que ofrece opciones de respuesta para facilitar la construcción de diálogos. Este enfoque no busca reemplazar la terapia, sino complementar, proporcionando una herramienta accesible que permite a los niños practicar habilidades comunicativas en un entorno seguro, aumentando su autonomía y confianza.

---

## Objetivos

**Objetivo general:**  
Diseñar y desarrollar un prototipo de chatbot que facilite la comunicación funcional en niños con TEA mediante una interfaz basada en texto, voz y pictogramas.

**Objetivos específicos:**
- Adquirir y preprocesar un conjunto de datos conversacionales relevante y adaptado a las necesidades comunicativas de los niños con TEA.
- Entrenar y evaluar dos modelos de Inteligencia Artificial (uno basado en reglas y otro de aprendizaje profundo) para la gestión del diálogo y la generación de respuestas.
- Desarrollar una interfaz gráfica de usuario (GUI) intuitiva y accesible que integre la entrada y salida de texto, voz y pictogramas.
- Validar la usabilidad y efectividad del prototipo con casos de prueba simulados que reflejan escenarios de la vida real.

---

# Adquisición de los Datos

## Obtención de datos

La base para un modelo de IA conversacional robusto es un conjunto de datos diverso y de alta calidad. El proceso para construir nuestro dataset se centró en la obtención, combinación y limpieza de múltiples fuentes de datos para entrenamiento de modelos de IA en español. Para ello, se realizó una búsqueda exhaustiva en plataformas de datasets como Github, Kaggle y Hugging Face. Finalmente, se seleccionaron tres conjuntos de datos de Hugging Face, obteniéndose mediante las librerías de pandas y datasets en Google Colab.

