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

Los datasets fuente fueron:

- **Harsit/xnli2.0_train_spanish:** Es parte de la Cross-lingual Natural Language Inference (XNLI) corpus. Se compone de pares de frases (premisa e hipótesis) en español. Es útil para tareas de comprensión del lenguaje natural y razonamiento, ya que aporta pares de frases que ayudan al modelo a entender el razonamiento y la inferencia.  Se obtuvo el dataset leyendo la ruta del archivo csv publicado de la fuente original.

  Obtenido de: [https://huggingface.co/datasets/Harsit/xnli2.0_train_spanish](https://huggingface.co/datasets/Harsit/xnli2.0_train_spanish)

    ```python
    # Cargar el dataset "xnli2.0_train_spanish"
    # Fuente: https://huggingface.co/datasets/Harsit/xnli2.0_train_spanish
    
    try:
        df_xnli = pd.read_csv("hf://datasets/Harsit/xnli2.0_train_spanish/spanish_train.csv")
    except Exception as e:
        print(f"Error loading xnli2.0_train_spanish: {e}")
        df_xnli = None
    
    if df_xnli is not None:
        df_xnli = df_xnli[['premise', 'hypothesis']].copy()
        df_xnli = df_xnli.rename(columns={'premise': 'pregunta', 'hypothesis': 'respuesta'})
        df_xnli = df_xnli[['pregunta', 'respuesta']]

- **Benjleite/FairytaleQA-translated-spanish:** Contiene preguntas y respuestas sobre cuentos infantiles en español. Es útil para tareas de respuesta a preguntas y comprensión de lectura. Dado que contiene preguntas y respuestas sencillas sobre cuentos infantiles, es un material temático ideal para nuestro público objetivo. El dataset se obtuvo mediante una lectura de json de los datos de entrenamiento de la fuente de origen.

  Obtenido de: [https://huggingface.co/datasets/benjleite/FairytaleQA-translated-spanish](https://huggingface.co/datasets/benjleite/FairytaleQA-translated-spanish)

  ```python
  # Cargar el dataset "FairytaleQA-translated-spanish"
  # Fuente: https://huggingface.co/datasets/benjleite/FairytaleQA-translated-spanish
  
  splits = {'train': 'train.json', 'validation': 'validation.json', 'test': 'test.json'}
  df = pd.read_json("hf://datasets/benjleite/FairytaleQA-translated-spanish/" + splits["train"])
  
  if 'df' in globals() and df is not None:
      df_fairytale = df[['question', 'answer']].copy()
      df_fairytale = df_fairytale.rename(columns={'question': 'pregunta', 'answer': 'respuesta'})
      df_fairytale = df_fairytale[['pregunta', 'respuesta']]
  else:
      df_fairytale = None
      print("FairytaleQA-translated-spanish dataframe not found.")


- **Kukedlc/spanish-train:** Contiene pares de instrucción y pregunta en español (equivalentes a input y output) de conversaciones e interacciones de un chatbot externo. Ofrece un corpus general de instrucciones y respuestas útil como conocimiento general del chatbot sobre diversos dominios de temas más avanzados. Asimismo, ofrece una estructura de ejemplo para estructurar las respuestas. Se obtuvieron los datos mediante `load_dataset`, una función que permite cargar conjunto de datos de Hugging Face.

  Obtenido de: [https://huggingface.co/datasets/Kukedlc/spanish-train](https://huggingface.co/datasets/Kukedlc/spanish-train)

  ```python
  # Cargar el dataset "spanish-train"
  # Fuente: https://huggingface.co/datasets/Kukedlc/spanish-train
  
  ds = load_dataset("Kukedlc/spanish-train")
  
  if 'ds' in globals() and ds is not None:
      df_spanish_train = ds['train'].to_pandas()
      df_spanish_train = df_spanish_train.rename(columns={'instruction': 'pregunta', 'output': 'respuesta'})
      df_spanish_train = df_spanish_train[['pregunta', 'respuesta']]
  else:
      df_spanish_train = None
      print("spanish-train dataset not found.")

## Descripción del conjunto de datos

En lugar de partir de un único archivo, nuestro conjunto de datos final es el resultado de la **combinación de tres fuentes distintas** obtenidas desde el **hub de Hugging Face**.  
Este enfoque garantiza una amplia variedad de **estilos de conversación, temas y niveles de complejidad**.

Estos datasets se cargaron y sus columnas se **estandarizaron a un formato común de pregunta y respuesta** antes de ser combinados en un único archivo.  
De este gran conjunto de datos, se extrajo una **muestra aleatoria** para crear el archivo que se utilizará en la fase de desarrollo:  
`combined_dataset_sample_5000.csv`.

## Preprocesamiento de datos

Antes de que los datos pudieran ser utilizados, se aplicó un proceso de **limpieza fundamental** sobre el dataset combinado (de más de **1.3 millones de filas**) para asegurar su calidad e integridad.  
Los pasos fueron los siguientes:

- **Limpieza de Nulos y Espacios en Blanco:** Se eliminaron todas las filas que no contenían valor en la columna *pregunta* o *respuesta*. Adicionalmente, se removieron los espacios en blanco al inicio y al final de cada texto para descartar registros que solo contenían espacios vacíos.

- **Eliminación de Duplicados:** Se aplicó una función para borrar todas las filas que eran copias exactas de otras. Este paso es crucial para evitar que el modelo de IA se sobreajuste a ejemplos repetidos y para garantizar que el conjunto de datos sea lo más variado posible.

- **Limitación de extensión de las cadenas de texto:** Se implementó un filtro para eliminar aquellas cadenas de texto que superaran las **150 palabras**. Dado que el modelo está en una etapa inicial, se optó por trabajar con un dataset limitado y controlado.

- **Normalización del texto:** Se estandarizó todo el texto, transformando las cadenas a **minúsculas**, eliminando **saltos de línea (\n)** y **tabulaciones (\t)**, y manejando algunas contracciones (por ejemplo, convertir *‘q’* en *que*). Este paso es importante para evitar inconsistencias al aplicar los algoritmos y asegurar que los resultados sean coherentes.

- **Tokenización del texto:** Se empleó un algoritmo de **tokenización** para dividir las cadenas de texto en palabras. Se agregaron nuevas columnas al dataset con los textos tokenizados, lo que proporciona flexibilidad para trabajar tanto con las cadenas completas como con las tokenizadas. Además, permite aplicar algoritmos de **procesamiento de lenguaje natural (NLP)** con mayor efectividad.

Una vez realizados estos procesos, se garantiza que el dataset es de **alta calidad**, sin datos corruptos, redundantes o poco eficientes para la construcción del modelo. Sin embargo, todavía se tiene un volumen considerable de datos no óptimo para procesar por los algoritmos seleccionados (**828,050 registros**). Por esta razón, se considerará una **muestra final de 6,000 registros aleatorios**, utilizando un **muestreo estratificado** con cada dataset como estrato.

