import Groq from 'groq-sdk';
import server, { Request, Response} from 'express';
import { config } from 'dotenv';
config();

interface IQuestion {
  text: string,
  group: string
}
const app = server();
const router = server.Router();
app.use(server.json());
app.use('/api',router);

const port = process.env.PORT || 3344;


const text:IQuestion[] = [
{
  text:'mi nombre es John',
  group: 'general'
},
{
  text:'mi asignatura es programación web',
  group: 'general',
},
{
  text: 'mis clases son a las 5:30',
  group: 'general',
},
{
  text:'en los siguientes días: los lunes y miércoles',
  group: 'general',
},
{
  text:'mi especialidad como profesional es el desarrollo de aplicaciones web y móviles',
  group: 'general',
},
{
  text:'los porcentaje que tienen las actividades de mi asignatura son: examen 25%, proyecto 25%, tarea 25%, participación 25%',
  group: 'general'
},
{
  text:'mi correo es john.cevallos@uleam.edu.ec',
  group: 'general'
},
{
  text:'los horarios en los que trabajo son: en la mañana desde las 9:00 hasta las 12:00 y en la tarde desde las 14:00 hasta las 18:00',
  group: 'general'
},
{
  text:'mi número de teléfono es privado lastimosamente',
  group: 'general'
},
{
  text:'La temática de mi asignatura es CSS, HTML, JavaScript, React, Node.js, MongoDB, Express, Firebase, entre otros',
  group: 'general'
},
{
  text:'me pueden encontrar en la sala de profesores de la parte baja o en mi oficina de titulación ya que soy responsable de esa área',
  group: 'general'
},
{
  text:'la rúbrica de las exposiciones es 1. Introducción 10%, 2. Desarrollo 30%, 3. Conclusión 10%, 4. Preguntas 10%, 5. Material 20%, 6. Tiempo 10%, 7. Participación 10%',
  group: 'general'
}
]
const generateContext= (parametro:IQuestion[], pregunta:string) => {
  let context = `Soy un docente universitario, 
  y quisiera darte el siguiente contexto: `;
  parametro.forEach((element) => {
    context += ` ${element.text} ,`;
  });
  context += ` por lo tanto como responderías si un alumno me hace la siguiente pregunta: ${pregunta}
  sin volver a repetir el mismo texto que te he proporcionado sino más bien solo dar la respuesta precisa, breve y plana.`;
  return context;
} 
const client = new Groq({
//   apiKey: process.env['GROQ_API_KEY'], 
  apiKey: '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', 
});
// main();

router.post('/chat',  async (req:Request  , res:Response) => {
  const { text: userInput } = req.body;

  if (!userInput) {
    res.status(400).send({ error: 'Text is required' });
    return;
  }
  

  try {
    const chatCompletion = await client.chat.completions.create({
      messages: [
        { role: 'user', content: generateContext(text, userInput) }
      ],
      model: 'llama3-8b-8192',
    });

    res.send({ response: chatCompletion.choices[0].message.content });
  } catch (error) {
    console.error(error);
    res.status(500).send({ error: 'Internal Server Error' });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});


// async function main() {
//   const chatCompletion = await client.chat.completions.create({
//     messages: [
//   { role: 'user'
//     , content: generateContext(text,'tengo una exposición pero desconozco la rúbrica')
//   }
//   ]
//     ,model: 'llama3-8b-8192',
//   });

//   console.log(chatCompletion.choices[0].message.content);
// }
