import { ICampaign } from "../interfaces";

const campaignList: ICampaign[] = [
  {
    id: 0,
    title: "O Cerco de Valkaria",
    image:
      "https://platform.polygon.com/wp-content/uploads/sites/2/2024/09/phb-2024-cover.jpeg?quality=90&strip=all&crop=0%2C24.5552761479%2C100%2C50.8894477042&w=2400",
    level: "Veterano",
    summary:
      "As forças do Reino do Reinado estão prestes a cair diante de um inimigo desconhecido. Valkaria está sitiada, e o caos se espalha pelas ruas. Seu grupo é parte da última resistência, e cada decisão pode selar o destino da cidade e de seus habitantes.",
    location: "Centro",
    system: "Tormenta",
    currentPartySize: 4,
    maxPartySize: 5,
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
  },
  {
    id: 2,
    title: "A Maldição do Vale Escarlate",
    image:
      "https://shortrest.files.wordpress.com/2023/10/dragonborn_bard_pg_59_326880__copy.0.jpg",
    level: "Intermediário",
    summary:
      "O vale está amaldiçoado há séculos, e aventureiros desaparecem misteriosamente ao atravessá-lo. Vocês são corajosos o suficiente para desvendar seus segredos?",
    location: "Vila Ipiranga",
    system: "Pathfinder 2e",
    currentPartySize: 5,
    maxPartySize: 5,
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
  },
];

const carousel = [
  {
    id: 1,
    image:
      "https://platform.polygon.com/wp-content/uploads/sites/2/2024/09/phb-2024-cover.jpeg?quality=90&strip=all&crop=0%2C24.5552761479%2C100%2C50.8894477042&w=2400",
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
      "https://shortrest.files.wordpress.com/2023/10/dragonborn_bard_pg_59_326880__copy.0.jpg",
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

export { advantages, campaignList, carousel };
