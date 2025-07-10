# WebSocket Chat Demo - React + Node.js

Demo de comunicación en tiempo real usando WebSockets nativos implementado con React y Node.js.

## Descripción

Este proyecto demuestra cómo implementar comunicación bidireccional en tiempo real entre múltiples clientes utilizando el protocolo WebSocket. La aplicación consiste en un chat donde los usuarios pueden enviar mensajes, cambiar sus nombres y ver una lista de usuarios conectados, todo actualizándose instantáneamente sin necesidad de recargar la página.

## Características

- Chat en tiempo real entre múltiples usuarios
- Lista de usuarios conectados
- Cambio de nombre de usuario dinámico-
- Reconexión automática en caso de pérdida de conexión
- Interfaz responsive
- WebSockets nativos (protocolo RFC 6455)

## Tecnologías Utilizadas

**Backend:**
- Node.js
- Express.js
- WebSocket (biblioteca ws)

**Frontend:**
- React 19
- Vite 

## Instalación y Configuración

### Prerrequisitos
- Node.js 16 o superior
- npm

### Pasos de instalación

1. Clonar el repositorio:
```bash
git clone https://github.com/TU_USUARIO/websocket-chat-demo.git
cd websocket-chat-demo
```

2. Instalar dependencias del servidor:
```bash
cd server
npm install
```

3. Instalar dependencias del cliente:
```bash
cd ../client
npm install
```

4. Ejecutar la aplicación:

**Terminal 1 - Iniciar servidor:**
```bash
cd server
npm run dev
```

**Terminal 2 - Iniciar cliente:**
```bash
cd client
npm run dev
```

5. Abrir el navegador:
- Aplicación cliente: http://localhost:5173
- Servidor: http://localhost:3001

## Uso

1. Abrir múltiples pestañas del navegador en http://localhost:5173 para simular varios usuarios
2. Escribir mensajes en el campo de texto y presionar "Enviar"
3. Los mensajes aparecerán instantáneamente en todas las pestañas abiertas
4. Cambiar el nombre de usuario utilizando el formulario en la barra lateral
5. Observar cómo la lista de usuarios se actualiza cuando otros se conectan o desconectan

## Estructura del Proyecto

```
websocket-chat-demo/
├── server/
│   ├── server.js          
│   └── package.json       
├── client/
│   ├── src/
│   │   ├── components/    
│   │   │   ├── Chat.jsx
│   │   │   ├── MessageList.jsx
│   │   │   ├── MessageInput.jsx
│   │   │   └── UserList.jsx
│   │   ├── hooks/
│   │   │   └── useWebSocket.js
│   │   ├── App.jsx        
│   │   ├── App.css       
│   │   └── main.jsx       
│   ├── index.html
│   ├── package.json       
│   └── vite.config.js     
└── README.md
```

## Conceptos Técnicos Implementados

- **Protocolo WebSocket**: Implementación del estándar RFC 6455 para comunicación bidireccional
- **Broadcasting**: Retransmisión de mensajes a todos los clientes conectados
- **Gestión de conexiones**: Manejo de múltiples conexiones simultáneas
- **Reconexión automática**: Sistema de reconexión en caso de pérdida de conexión
- **Custom Hook**: Hook personalizado de React para encapsular la lógica de WebSocket
- **Manejo de estado**: Uso de React Hooks para gestionar el estado de la aplicación

## Consideraciones de Desarrollo

- Se desactivó React StrictMode durante el desarrollo para evitar conexiones WebSocket duplicadas
- El servidor maneja la desconexión de clientes y notifica a otros usuarios
- Se implementó un sistema de IDs únicos para cada cliente conectado
- El frontend incluye manejo de errores y reconexión automática
