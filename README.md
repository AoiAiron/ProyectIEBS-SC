





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

# Contrato del Marketplace
- 0x95da1F276289462093C05daC3D341739Ee7B504F
- (https://sepolia.etherscan.io/address/0x95da1f276289462093c05dac3d341739ee7b504f)

```shell
npx hardhat help
npx hardhat test
REPORT_GAS=true npx hardhat test
npx hardhat node
npx hardhat ignition deploy ./ignition/modules/Lock.js
```
