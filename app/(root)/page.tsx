import PostCard, { PostCardType } from "../components/PostCard";

export default function Home() {
  const postMock : PostCardType[] = [{
    _id: "abc123",
    _type: "post",
    _createdAt: "2025-02-21T12:00:00Z",
    _updatedAt: "2025-02-21T12:30:00Z",
    _rev: "r1",
    title: "Como aprender JavaScript rapidamente com o carlos o melhor de todos",
    author: {
      _id: "user123",
      _type: "user",
      _createdAt: "2023-01-15T09:30:00Z",
      _updatedAt: "2025-02-20T12:00:00Z",
      _rev: "r1",
      name: "Carlos Silva",
      username: "carlosjs",
      email: "carlos.silva@email.com",
      image: "https://placehold.co/68x68",
      bio: "Desenvolvedor Front-end apaixonado por JavaScript e novas tecnologias.",
    },
    views: 1500,
    likes: 250,
    category: {
      _id: "category456",
      _type: "category",
      _createdAt: "2023-01-15T09:30:00Z",
      _updatedAt: "2025-02-20T12:00:00Z",
      _rev: "r1",
      category: "Desenvolvimento Web",
    },
      post: `
Este post vai te guiar pelas melhores práticas e técnicas para dominar o JavaScript. Vamos aprender desde os conceitos mais básicos até técnicas avançadas.  
### Passo 1: Entenda o Básico  
Antes de começar, é fundamental entender os conceitos principais do JavaScript, como variáveis, tipos de dados, loops e funções. Se você já tem uma boa base de programação, isso será bem tranquilo.  
### Passo 2: Pratique com Projetos Simples  
Crie pequenos projetos para reforçar o aprendizado, como uma calculadora simples ou um aplicativo de lista de tarefas.  
### Passo 3: Explore Recursos Avançados  
Após dominar o básico, comece a explorar as funcionalidades avançadas como promessas, async/await e manipulação de eventos. Essas habilidades são essenciais para trabalhar com JavaScript moderno.  
Com dedicação e prática constante, você se tornará um especialista em JavaScript rapidamente! 
`,
totalComments: 20
    }];
  return (
    <>
    <section>
      <h1>Home</h1>
      <p>Welcome to your new site.</p>
    </section>

    <section className="flex flex-col items-center p-4">
      {
        postMock.map((post) =>{
          return <PostCard key={post._id} post={post}/>
        })
      }
    </section>
    </>
  );
}
