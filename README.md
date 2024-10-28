





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
(NECESITO LAS FOTOS DEL DEPLOYMENT EN HARDHAT)

# Ejemplo de implementación
Para implementar este contrato, sigue los siguientes pasos:
- Despliega el contrato **Marketplace** especificando las direcciones de los contratos ERC-20 y ERC-721 en el constructor.
- Usa **listNFT** para listar tus tokens NFT a la venta en el marketplace.
- Para comprar un NFT listado, usa **purchaseNFT**, y el NFT será transferido al comprador tras el pago.


# Explorador de bloques

- **CONTRATO TOKEN.SOL(ORO)**
0xFeC0Dc8C2Fc9479Af63ad2Be21f36fCFadc2f734
https://sepolia.etherscan.io/tx/0x309fa807d58168f3a88ddcb6b8635d9f99597422c1c787a64ee8ef40ee80fc4d


- **CONTRATO CREATURES.SOL**
0x1313c30eE47B841d8a2b1f4E79e86ABE62919cCb
https://sepolia.etherscan.io/tx/0x0fb94af29763a3225f87fae78b300c032fee8a6d92c1b4cf4616826ebfaf0a66

- **Obtain creature 1**
https://sepolia.etherscan.io/tx/0xba5c56b864a2081c8df4cdc48f2e57628267bdd02183080d918bd6b22c66b827
- **Obtain creature2**
https://sepolia.etherscan.io/tx/0x9adff51e5fa040b82e4fe0f3ed42e9f36693817e07f6003e2ece0f23a4a02120
- **Obtain creature 3**
https://sepolia.etherscan.io/tx/0xb7038015e81b3fea54bdba87e0a70a09aee5b9ebc633d3146764bbef0c30b447

- **MARKETPLACE**
0x7C74fE55Fc5469368D53061adC85fA7115f0a576
https://sepolia.etherscan.io/tx/0x269af11631e5c5734867c7b9650d86635db4dd86353777e707b8939c48144784
- **Envio de 1 creature nft al Marketplace**
https://sepolia.etherscan.io/tx/0x0665c1523ef733553bd0a57cafd98c2b2eb0730765470b15e2737adfe510c94e


```shell
npx hardhat help
npx hardhat test
REPORT_GAS=true npx hardhat test
npx hardhat node
npx hardhat ignition deploy ./ignition/modules/Lock.js
```
