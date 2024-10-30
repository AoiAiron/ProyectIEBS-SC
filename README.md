





# PROYECTO Marketplace de NFT

Este proyecto consta de varios Smartcontracts en Solidity que implementa un marketplace para tokens NFT, permitiendo a los usuarios listar y comprar tokens no fungibles (NFT) utilizando un token ERC-20 como medio de pago.

Para esto usaremos 3 contratos:

- **Contrato marketplace.sol:** Es el contrato del marketplace donde se podrán intercambiar los tokens ERC-20 por los NFT´S.
- **Contrato Token.sol:** Es el contrato para generar los tokens ERC-20 que usaremos como medio de pago para comprar los tokens ERC-721 (NFT´s)
- **Contrato creatures.sol:** Contrato para crear los tokens ERC-721 que los usuarios podrán comprar.


# Características del Contrato marketplace.sol
- **Listado de NFT:** Los propietarios de NFT pueden listar sus tokens en venta especificando el precio en un token ERC-20.
- **Compra de NFT:** Los compradores pueden adquirir los NFT listados transfiriendo el precio establecido al vendedor.
- **Actualización de precio:** Los vendedores pueden actualizar el precio de su NFT en cualquier momento.

# Requisitos previos
- Este contrato utiliza las interfaces de OpenZeppelin para ERC-721 (NFT) y ERC-20 (tokens fungibles), así como para la gestión de propiedad.

# Variables principales (Constructor)
- **paymentToken:** Contrato del token ERC-20 que se utiliza como medio de pago.
- **nftContract:** Contrato del token NFT que se venderá en el marketplace.

- **mapping** Mapeo que almacena los listados de NFTs en venta.

# Eventos
- **NFTListed:** Emitido cuando un NFT se lista en el marketplace.
- **NFTPurchased:** Emitido cuando un NFT es comprado exitosamente.

# Funciones principales

- **listNFT:** Lista un NFT en el marketplace especificando un precio en el token de pago.
- require nftContract.ownerOf y require nftContract.getApproved/Requiere que el llamador sea propietario del token y que el marketplace tenga aprobación para transferir el NFT.

- **purchaseNFT:** Permite que un comprador adquiera un NFT listado.
- require listedNFT.price > 0 y require paymentToken.transferFrom /El comprador debe tener suficiente balance en paymentToken y haber aprobado el gasto para esta transacción.

- **updateNFTPrice:** Permite al vendedor de un NFT cambiar el precio del token listado.

## Contrato Creatures.sol 
Permite mintear un NFT ERC721 al que asocia como creature.

Caracteristicas de las criaturas:
- name: El nombre de la criatura, que se saca aleatorio de un array definido.
- elementType: El tipo de elemento (fuego, agua, tierra o aire), como enum.
- level: El nivel de la criatura, que siempre empieza en 1.
- attackPower: La potencia de ataque de la criatura (valor entre 1 y 100, generado aleatoriamente).
- defensePower: La potencia de defensa de la criatura (valor entre 1 y 100, también generado aleatoriamente). 

### Variables Principales

- **_nextTokenId:**  Lleva registro del próximo ID de token que se asignará. Inicializa en 1 y se incrementa cada vez que se mintea una nueva criatura.
- **creatures:** Un mapping que almacena la información de cada criatura asociada a su respectivo ID.

**Estructura (caracteristicas de la creatura)**
- string name;             // Nombre de la criatura 
- ElementType elementType; // El tipo de elemento
- uint256 level;           // Level de la criatura 
- uint256 attackPower;     // Poder de ataque 
- uint256 defensePower;    // Poder de defensa 

### Funciones Principales
- **obtainCreature(address player):** Permite mintear una creatura, asignandola a un jugador (address) 
- **_random:** Busca generar un número aleatorio, usando informacion disponible en el bloque como el momento en que fue validado, el último randao del bloque del epoch anterior y la dirección que hace la llamada. En este momento es previsible y debido a tiempos en la cadena el poder de ataque suele ser igual al poder de defensa (que usan la fucion), se podria mejorar buscando el número aleatorio externo o usando otros recursos como Chainlink.

### Eventos
- **CreatureObtained:** Se emite cada vez que una criatura es obtenida por un jugador.

## Token.sol
Este contrato permite la creación y administración de un token ERC20 personalizado, con funciones de emisión (minting) y quema (burning) controladas por un administrador (centralizado). Implementa un suministro máximo fijo (maxSupply), lo que asegura que no se puedan emitir tokens de forma ilimitada.

**Funciones**
- **mint(uint256 _amount, address _to)**: Permite mintear nuevos tokens, solo el administrador puede llamar a esta función. Revierte si la cantidad es 0 o si se excede el suministro máximo. Los tokens se mintean en la dirección del administrador y luego se transfieren a la dirección especificada _to, si se especifica.
- **burn(uint256 _amount):** Permite quemar (burn) tokens, solo el administrador puede llamar a esta función. Realiza la quema de tokens en la cuenta del administrador.
- **setAdmin(address _admin):** Permite cambiar la dirección del administrador. Solo el administrador esta autorizado para realizarlo.



## Configuracion y Despliegue con Hardhat

### 1. Agregar OpenZeppelin Contracts 
```
npm install @openzeppelin/contracts
```
### 2. Compilar
```
npx hardhat compile
```
### 3. Verificar test
```
npx hardhat test
```
### 4. Iniciar nodo
```
npx hardhat node
```
### 5. Abrir otra consola para desplegar los contratos en local
```
npx hardhat ignition deploy ./ignition/modules/creatures.js --network localhost
npx hardhat ignition deploy ./ignition/modules/items.js --network localhost
npx hardhat ignition deploy ./ignition/modules/battle.js --network localhost
```

# TEST
<a href="https://ibb.co/dmDZqRS"><img src="https://i.ibb.co/jJDt2Sd/Imagen-de-Whats-App-2024-10-30-a-las-05-11-35-ee170480.jpg" alt="Imagen-de-Whats-App-2024-10-30-a-las-05-11-35-ee170480" border="0"></a>
<a href="https://ibb.co/NN12g2V"><img src="https://i.ibb.co/fN8dVd1/Imagen-de-Whats-App-2024-10-30-a-las-05-11-14-9e0aebec.jpg" alt="Imagen-de-Whats-App-2024-10-30-a-las-05-11-14-9e0aebec" border="0"></a>

# Ejemplo de implementación
Para implementar este contrato, sigue los siguientes pasos:
- Despliega el contrato **Marketplace** especificando las direcciones de los contratos ERC-20 y ERC-721 en el constructor.
- Usa **listNFT** para listar tus tokens NFT a la venta en el marketplace.
- Para comprar un NFT listado, usa **purchaseNFT**, y el NFT será transferido al comprador tras el pago.


# Explorador de bloques

- **Contrato Token - Verificado** 0x4856cc7769B30F77C62aEd0927c7Ac8F06A5A34c
- https://sepolia.etherscan.io/address/0x4856cc7769B30F77C62aEd0927c7Ac8F06A5A34c
- Transaction - Minting Tokens to other address
- https://sepolia.etherscan.io/tx/0xc49276e0e296111b68b806e36cc66ba05585f5b08686636023db7ebce8f79bad
- **Contrato Creatures – Verificado** 0xDFCE0bD0DFC126a0FBD84eA905F75d04b972e7Dc
- https://sepolia.etherscan.io/address/0xDFCE0bD0DFC126a0FBD84eA905F75d04b972e7Dc
- **Transaction – Obtain Creature 1**
- https://sepolia.etherscan.io/tx/0xa6f38ce7f308774d8f1d04e79e9012ba9493fd9788bc0790f42663d321fa5965
- **Contrato Marketplace – Verificado** 0xf326d606654578f4c68C308EEA56F7C06FF56f9f
- https://sepolia.etherscan.io/address/0xf326d606654578f4c68C308EEA56F7C06FF56f9f

# NOTA:
- Tras multiples pruebas, los contratos funcionan en local. Pero al hacer las pruebas en la red sepolia con el último contrato (marketplace) no se ha podido completar la transacción.
Agradeceriamos una revisión del contrato por si encuentra algun fallo que se nos haya pasado por alto.

```shell
npx hardhat help
npx hardhat test
REPORT_GAS=true npx hardhat test
npx hardhat node
npx hardhat ignition deploy ./ignition/modules/Lock.js
```
