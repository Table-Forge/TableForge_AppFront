import { ICharacter } from "@/src/interfaces/character.interfaces";

const campaignList = [
  {
    id: 0,
    title: "O Cerco de Valkaria",
    image:
      "https://i.pinimg.com/736x/3d/18/91/3d1891fc3a2b01655f73b98df007feb8.jpg",
    level: "Veterano",
    summary:
      "Valkaria está sitiada e o caos se espalha pelas ruas. Seu grupo é a última resistência.",
    fullDescription:
      "As forças do Reino do Reinado estão prestes a cair diante de um inimigo desconhecido. Valkaria está sitiada, e o caos se espalha pelas ruas. Seu grupo é parte da última resistência, e cada decisão pode selar o destino da cidade e de seus habitantes. Preparem seus dados para uma campanha épica de resistência e estratégia.",
    location: "Centro",
    system: "Tormenta 20",
    currentPartySize: 4,
    maxPartySize: 5,
    gameMaster: "Kassandra Tenebra",
    frequency: "Semanal",
    nextSession: { day: "Sábado", time: "19:00h" },
    players: [
      { id: "1", name: "Erik", avatar: "https://i.pravatar.cc/150?u=1" },
      { id: "2", name: "Alana", avatar: "https://i.pravatar.cc/150?u=2" },
      { id: "3", name: "Thorin", avatar: "https://i.pravatar.cc/150?u=3" },
      { id: "4", name: "Vex", avatar: "https://i.pravatar.cc/150?u=4" },
    ],
  },
  {
    id: 1,
    title: "Shadows Over Londrina",
    image:
      "https://images.squarespace-cdn.com/content/v1/605e90f9c17ee25104dba783/1696448239405-LW45NVW93EEWGIHAHMOW/Screenshot+2023-10-04+123658.png?format=2500w",
    level: "Iniciante",
    summary:
      "Uma névoa misteriosa cobre a cidade enquanto criaturas das sombras espreitam.",
    fullDescription:
      "Inspirado no folclore urbano, Shadows Over Londrina coloca jogadores iniciantes frente a frente com o sobrenatural escondido no Jardim Inglaterra. Uma campanha de investigação e terror leve.",
    location: "Jardim Inglaterra",
    system: "D&D 5e",
    currentPartySize: 3,
    maxPartySize: 6,
    gameMaster: "Mestre 'Pé Vermelho'",
    frequency: "Quinzenal",
    nextSession: { day: "Domingo", time: "14:00h" },
    players: [
      { id: "5", name: "Juca", avatar: "https://i.pravatar.cc/150?u=5" },
      { id: "6", name: "Bia", avatar: "https://i.pravatar.cc/150?u=6" },
      { id: "7", name: "Caio", avatar: "https://i.pravatar.cc/150?u=7" },
    ],
  },
  {
    id: 2,
    title: "A Maldição do Vale Escarlate",
    image:
      "https://i.pinimg.com/1200x/0a/06/a6/0a06a6aa5db0efbec13033ba05ae7729.jpg",
    level: "Intermediário",
    summary:
      "O vale está amaldiçoado há séculos. Vocês são corajosos o suficiente?",
    fullDescription:
      "Sangue e mistério aguardam no Vale Escarlate. Uma campanha focada em combate tático e exploração de masmorras em Pathfinder 2e.",
    location: "Vila Ipiranga",
    system: "Pathfinder 2e",
    currentPartySize: 5,
    maxPartySize: 5,
    gameMaster: "Evelyn Bloodrose",
    frequency: "Mensal",
    nextSession: { day: "Sexta", time: "20:00h" },
    players: [
      { id: "8", name: "Ray", avatar: "https://i.pravatar.cc/150?u=8" },
      { id: "9", name: "Luna", avatar: "https://i.pravatar.cc/150?u=9" },
      { id: "10", name: "Sol", avatar: "https://i.pravatar.cc/150?u=10" },
      { id: "11", name: "Mars", avatar: "https://i.pravatar.cc/150?u=11" },
      { id: "12", name: "Jup", avatar: "https://i.pravatar.cc/150?u=12" },
    ],
  },
  {
    id: 3,
    title: "Operação Aurora Negra",
    image:
      "https://images.ctfassets.net/swt2dsco9mfe/4GhYDHCEuhO6C9eJK3pBY1/c1712db014c5f9c7014bdfb07287d0ae/dnd_learntoplay_hero1.jpg?q=70&w=1920",
    level: "Avançado",
    summary:
      "Em um futuro distópico, seu grupo mercenário deve derrubar gigantes corporativos.",
    fullDescription:
      "Alta tecnologia, baixa fidelidade. Em Aurora Negra, o objetivo é infiltração e hacking. Prepare seu deck e suas armas.",
    location: "Gleba Palhano",
    system: "Cyberpunk RED",
    currentPartySize: 2,
    maxPartySize: 5,
    gameMaster: "Deckard Cyber",
    frequency: "Semanal",
    nextSession: { day: "Quinta", time: "21:00h" },
    players: [
      { id: "13", name: "Neo", avatar: "https://i.pravatar.cc/150?u=13" },
      { id: "14", name: "Trinity", avatar: "https://i.pravatar.cc/150?u=14" },
    ],
  },
  {
    id: 4,
    title: "Os Ecos de Arton",
    image:
      "https://static1.cbrimages.com/wordpress/wp-content/uploads/2021/02/Dungeons-and-Dragons-Party.jpg",
    level: "Veterano",
    summary:
      "Os deuses antigos retornaram e o equilíbrio de Arton está prestes a ser quebrado.",
    fullDescription:
      "Os deuses antigos retornaram, e o equilíbrio do mundo de Arton está prestes a ser quebrado. Você e seu grupo de aventureiros devem decidir entre apoiar ou enfrentar essas entidades em uma jornada que mudará a geografia do mundo. Uma campanha épica focada em interpretação e combates de alto nível.",
    location: "Vila Casoni",
    system: "Tormenta 20",
    currentPartySize: 4,
    maxPartySize: 6,
    gameMaster: "Leonel Arton",
    frequency: "Quinzenal",
    nextSession: { day: "Sábado", time: "14:00h" },
    players: [
      { id: "p13", name: "Sandro", avatar: "https://i.pravatar.cc/150?u=p13" },
      {
        id: "p14",
        name: "Lisandra",
        avatar: "https://i.pravatar.cc/150?u=p14",
      },
      { id: "p15", name: "Niele", avatar: "https://i.pravatar.cc/150?u=p15" },
      { id: "p16", name: "Tarrask", avatar: "https://i.pravatar.cc/150?u=p16" },
    ],
  },
  {
    id: 5,
    title: "Segredos da Vila Esquecida",
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR4NavSgE5sdFfROPsuddCGc_dJ7TFsFUjhwQ&s",
    level: "Iniciante",
    summary:
      "Uma vila afastada guarda segredos antigos. Algo está corrompendo os moradores...",
    fullDescription:
      "Uma vila afastada do mapa guarda segredos antigos e perigosos. Algo está corrompendo os moradores... e talvez até você. Nesta campanha de horror investigativo, a sanidade é seu recurso mais precioso. Ideal para jogadores que preferem mistério e atmosfera pesada.",
    location: "Shangri-lá",
    system: "Call of Cthulhu",
    currentPartySize: 1,
    maxPartySize: 4,
    gameMaster: "H.P. Craft",
    frequency: "Mensal",
    nextSession: { day: "Sexta-feira", time: "21:00h" },
    players: [
      { id: "p17", name: "Thomas", avatar: "https://i.pravatar.cc/150?u=p17" },
    ],
  },
];

const carousel = [
  {
    id: 1,
    image:
      "https://i.pinimg.com/736x/3d/18/91/3d1891fc3a2b01655f73b98df007feb8.jpg",
    title: "Encontre Sua Party",
  },
  {
    id: 2,
    image:
      "https://images.squarespace-cdn.com/content/v1/605e90f9c17ee25104dba783/1696448239405-LW45NVW93EEWGIHAHMOW/Screenshot+2023-10-04+123658.png?format=2500w",
    title: "Marque Encontros Épicos",
  },
  {
    id: 3,
    image:
      "https://i.pinimg.com/1200x/0a/06/a6/0a06a6aa5db0efbec13033ba05ae7729.jpg",
    title: "Crie Sua Própria Campanha",
  },
  {
    id: 4,
    image:
      "https://images.ctfassets.net/swt2dsco9mfe/4GhYDHCEuhO6C9eJK3pBY1/c1712db014c5f9c7014bdfb07287d0ae/dnd_learntoplay_hero1.jpg?q=70&w=1920",
    title: "Destrua Seus Inimigos",
  },
  {
    id: 5,
    image:
      "https://i0.wp.com/dungeonsanddragonsfan.com/wp-content/uploads/2024/11/2024-dnd-character-sheets-pdf.png?fit=800%2C450&ssl=1",
    title: "Crie Seu Personagem Favorito",
  },
];

const advantages = [
  {
    text: "Criar e salvar personagens ilimitados na página de perfil",
  },
  { text: "Criar tópicos no Fórum" },
  { text: "Selo Nobre ao lado do nome do usuário" },
  {
    text: "Destaque nas campanhas criadas por você, aparecendo por primeiro na listagem",
  },
  { text: "Campanhas privadas" },
  { text: "Todas as funcionalidades do Plano Plebeu" },
];

const charactersList: ICharacter[] = [
  {
    id: 1,
    name: "Sauriel",
    image:
      "https://i.pinimg.com/736x/b1/51/2b/b1512b3d4aca8b407421300d1e23d436.jpg",
    class: "Guerreiro",
    race: "Draconato",
    alignment: "Leal e Bom",
    history:
      "Um nobre guerreiro que busca restaurar a honra de sua linhagem após seu clã ser traído.",
  },
  {
    id: 2,
    name: "Valerius",
    image:
      "https://i.pinimg.com/736x/b0/20/86/b02086b903eab208886aff98e746fc10.jpg",
    class: "Paladino",
    race: "Humano",
    alignment: "Leal e Neutro",
    history:
      "Um cavaleiro errante que jurou proteger os fracos, custe o que custar.",
  },
  {
    id: 3,
    name: "Xyla",
    image:
      "https://i.pinimg.com/736x/76/26/87/762687ed380be55e50d24aa41aed91fb.jpg",
    class: "Maga",
    race: "Tiefling",
    alignment: "Caótico e Neutro",
    history:
      "Expulsa de sua academia por estudar magias proibidas, ela busca conhecimento oculto no mundo.",
  },
];

export { advantages, campaignList, carousel, charactersList };
