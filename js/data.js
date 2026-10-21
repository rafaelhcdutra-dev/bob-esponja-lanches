// =====================================================
//  ARQUIVO DE CONFIGURAÇÃO - EDITE AQUI
// =====================================================
const CONFIG = {
  nome: "Bob Esponja Lanches",
  whatsapp: "5511944813039",
  instagram: "https://www.instagram.com/bobesponja.lanchessalto/",
  taxaEntrega: 6.00,
  diasAbertos: [0, 2, 3, 4, 5, 6],   // 0=Dom, 1=Seg, 2=Ter ... 6=Sáb
  abre: 18,                           // 18h
  fecha: 23.5,                        // 23h30
  horarioTexto: "Ter a Dom, 18h às 23h30"
};

const CATEGORIAS = [
  { id: "hamburgueres", nome: "Hambúrgueres do Siri", ico: "🍔" },
  { id: "porcoes", nome: "Porções da Fenda", ico: "🍟" },
  { id: "bebidas", nome: "Bebidas da Fenda", ico: "🥤" },
  { id: "sobremesas", nome: "Sobremesas", ico: "🍦" }
];

// A foto de cada produto é images/produtos/<id>.jpg
// (ou defina img: "images/produtos/outra-foto.png" no produto)
const PRODUTOS = [
  { id: "hamburguer-siri-classico", cat: "hamburgueres", nome: "Hambúrguer de Siri Clássico", desc: "Pão brioche, blend bovino de 150g, queijo prato, alface, tomate e molho da casa.", preco: 24.90, img: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=900&q=80" },
  { id: "siri-cascudo-duplo", cat: "hamburgueres", nome: "Siri Cascudo Duplo", desc: "Dois blends de 150g, cheddar, bacon crocante, cebola caramelizada e molho especial.", preco: 34.90, img: "https://images.unsplash.com/photo-1553979459-d2229ba7433a?auto=format&fit=crop&w=900&q=80" },
  { id: "combo-patrick-star", cat: "hamburgueres", nome: "Combo Patrick Star", desc: "Hambúrguer com queijo, batata frita média e refrigerante em lata.", preco: 39.90, img: "https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&w=900&q=80" },
  { id: "siri-da-sandy", cat: "hamburgueres", nome: "Siri da Sandy (Frango Crocante)", desc: "Filé de frango empanado, queijo, alface, tomate e maionese temperada.", preco: 26.90, img: "https://images.unsplash.com/photo-1606755962773-d324e0a13086?auto=format&fit=crop&w=900&q=80" },
  { id: "batata-lula-molusco", cat: "porcoes", nome: "Batata Frita do Lula Molusco", desc: "Porção de 400g bem crocante, com sal e orégano.", preco: 22.90, img: "https://images.unsplash.com/photo-1573080496219-bb080dd4f877?auto=format&fit=crop&w=900&q=80" },
  { id: "aneis-sr-siriguejo", cat: "porcoes", nome: "Anéis de Cebola do Sr. Siriguejo", desc: "300g de anéis empanados com molho barbecue.", preco: 24.90, img: "https://images.unsplash.com/photo-1639024471283-03518883512d?auto=format&fit=crop&w=900&q=80" },
  { id: "iscas-da-fenda", cat: "porcoes", nome: "Iscas de Frango da Fenda", desc: "350g de tirinhas empanadas com maionese de ervas.", preco: 29.90, img: "https://images.unsplash.com/photo-1562967914-608f82629710?auto=format&fit=crop&w=900&q=80" },
  { id: "nuggets-agua-viva", cat: "porcoes", nome: "Nuggets da Água-Viva", desc: "12 unidades douradinhas com molho agridoce.", preco: 19.90, img: "https://images.unsplash.com/photo-1562967914-608f82629710?auto=format&fit=crop&w=900&q=80" },
  { id: "suco-bolha-de-sabao", cat: "bebidas", nome: "Suco Bolha de Sabão", desc: "Limão com hortelã e gelo, 400ml.", preco: 9.90, img: "https://images.unsplash.com/photo-1513558161293-cdadcf081d65?auto=format&fit=crop&w=900&q=80" },
  { id: "refrigerante-lata", cat: "bebidas", nome: "Refrigerante em Lata", desc: "Lata de 350ml, bem gelada.", preco: 6.50, img: "https://images.unsplash.com/photo-1629203851122-3726ecdf080e?auto=format&fit=crop&w=900&q=80" },
  { id: "milkshake-plankton", cat: "bebidas", nome: "Milk-shake do Plankton", desc: "Chocolate cremoso com chantilly, 400ml.", preco: 17.90, img: "https://images.unsplash.com/photo-1572490122747-3968b75cc699?auto=format&fit=crop&w=900&q=80" },
  { id: "agua-mineral", cat: "bebidas", nome: "Água Mineral", desc: "Garrafa de 500ml, com ou sem gás.", preco: 3.50, img: "https://images.unsplash.com/photo-1523362628745-0c100150b504?auto=format&fit=crop&w=900&q=80" },
  { id: "sorvete-do-gary", cat: "sobremesas", nome: "Sorvete do Gary", desc: "Copinho de baunilha com calda de chocolate.", preco: 12.90, img: "https://images.unsplash.com/photo-1563805042-7684c019e1cb?auto=format&fit=crop&w=900&q=80" },
  { id: "brownie-da-praia", cat: "sobremesas", nome: "Brownie da Praia", desc: "Brownie quentinho com bola de sorvete.", preco: 16.90, img: "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&w=900&q=80" },
  { id: "pudim-do-bob", cat: "sobremesas", nome: "Pudim do Bob", desc: "Fatia generosa de pudim de leite com calda de caramelo.", preco: 11.90, img: "https://images.unsplash.com/photo-1551024506-0a59b4a3d0d9?auto=format&fit=crop&w=900&q=80" },
  { id: "banana-split-da-fenda", cat: "sobremesas", nome: "Banana Split da Fenda", desc: "Banana, três sabores de sorvete, calda e chantilly.", preco: 21.90, img: "https://images.unsplash.com/photo-1563805042-7684c019e1cb?auto=format&fit=crop&w=900&q=80" }
];
