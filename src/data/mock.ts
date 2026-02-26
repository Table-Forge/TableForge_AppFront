import { ICharacter } from "@/src/interfaces/character.interfaces";
import { ICampaign } from "../interfaces";

const campaignList: ICampaign[] = [
  {
    id: 0,
    title: "O Cerco de Valkaria",
    image:
      "https://i.pinimg.com/736x/3d/18/91/3d1891fc3a2b01655f73b98df007feb8.jpg",
    level: "Veterano",
    summary:
      "As forças do Reino do Reinado estão prestes a cair diante de um inimigo desconhecido. Valkaria está sitiada, e o caos se espalha pelas ruas. Seu grupo é parte da última resistência, e cada decisão pode selar o destino da cidade e de seus habitantes.",
    location: "Centro",
    system: "Tormenta",
    currentPartySize: 4,
    maxPartySize: 5,
    gameMaster: "Kassandra Tenebra",
  },
  {
    id: 1,
    title: "Shadows Over Londrina",
    image:
      "https://images.squarespace-cdn.com/content/v1/605e90f9c17ee25104dba783/1696448239405-LW45NVW93EEWGIHAHMOW/Screenshot+2023-10-04+123658.png?format=2500w",
    level: "Iniciante",
    summary:
      "Uma névoa misteriosa cobre a cidade enquanto criaturas das sombras espreitam nas vielas. Você e seu grupo são a última linha de defesa.",
    location: "Jardim Inglaterra",
    system: "D&D 5e",
    currentPartySize: 3,
    maxPartySize: 6,
    gameMaster: "Mestre 'Pé Vermelho'",
  },
  {
    id: 2,
    title: "A Maldição do Vale Escarlate",
    image:
      "https://i.pinimg.com/1200x/0a/06/a6/0a06a6aa5db0efbec13033ba05ae7729.jpg",
    level: "Intermediário",
    summary:
      "O vale está amaldiçoado há séculos, e aventureiros desaparecem misteriosamente ao atravessá-lo. Vocês são corajosos o suficiente para desvendar seus segredos?",
    location: "Vila Ipiranga",
    system: "Pathfinder 2e",
    currentPartySize: 5,
    maxPartySize: 5,
    gameMaster: "Evelyn Bloodrose",
  },
  {
    id: 3,
    title: "Operação Aurora Negra",
    image:
      "https://images.ctfassets.net/swt2dsco9mfe/4GhYDHCEuhO6C9eJK3pBY1/c1712db014c5f9c7014bdfb07287d0ae/dnd_learntoplay_hero1.jpg?q=70&w=1920",
    level: "Avançado",
    summary:
      "Em um futuro distópico, corporações controlam tudo. Seu grupo de mercenários foi contratado para derrubar um dos gigantes do setor.",
    location: "Gleba Palhano",
    system: "Cyberpunk RED",
    currentPartySize: 2,
    maxPartySize: 5,
    gameMaster: "Deckard Cyber",
  },
  {
    id: 4,
    title: "Os Ecos de Arton",
    image:
      "https://static1.cbrimages.com/wordpress/wp-content/uploads/2021/02/Dungeons-and-Dragons-Party.jpg",
    level: "Veterano",
    summary:
      "Os deuses antigos retornaram, e o equilíbrio do mundo de Arton está prestes a ser quebrado. Você deve decidir entre apoiar ou enfrentar essas entidades.",
    location: "Vila Casoni",
    system: "Tormenta 20",
    currentPartySize: 4,
    maxPartySize: 6,
    gameMaster: "Leonel Arton",
  },
  {
    id: 5,
    title: "Segredos da Vila Esquecida",
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR4NavSgE5sdFfROPsuddCGc_dJ7TFsFUjhwQ&s",
    level: "Iniciante",
    summary:
      "Uma vila afastada do mapa guarda segredos antigos e perigosos. Algo está corrompendo os moradores... e talvez até você.",
    location: "Shangri-lá",
    system: "Call of Cthulhu",
    currentPartySize: 1,
    maxPartySize: 4,
    gameMaster: "H.P. Craft",
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
