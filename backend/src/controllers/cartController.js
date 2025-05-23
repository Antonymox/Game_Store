const { getRepository } = require("typeorm")
const Cart = require("../entities/Cart")

// Obtener el carrito del usuario
exports.getCart = async (req, res) => {
  try {
    console.log('Petición recibida para obtener carrito. Usuario:', req.user)
    
    if (!req.user || !req.user.id) {
      console.log('Usuario no autenticado o ID no encontrado')
      return res.status(401).json({ 
        message: "Usuario no autenticado",
        details: "Se requiere autenticación para acceder al carrito" 
      })
    }

    const cartRepository = getRepository(Cart)
    const userId = req.user.id
    console.log('Buscando carrito para el usuario:', userId)

    let cart = await cartRepository.findOne({ where: { userId } })
    console.log('Carrito encontrado en BD:', cart)

    if (!cart) {
      console.log('Creando nuevo carrito para el usuario:', userId)
      // Si el usuario no tiene carrito, crear uno nuevo
      cart = cartRepository.create({
        userId,
        items: [],
        totalItems: 0,
        totalPrice: 0,
      })
      await cartRepository.save(cart)
      console.log('Nuevo carrito creado:', cart)
    }

    console.log('Enviando carrito al cliente:', cart)
    res.status(200).json(cart)
  } catch (error) {
    console.error("Error al obtener el carrito:", error)
    res.status(500).json({ message: "Error en el servidor" })
  }
}

// Actualizar el carrito
exports.updateCart = async (req, res) => {
  try {
    const cartRepository = getRepository(Cart)
    const userId = req.user.id
    const { items, totalItems, totalPrice } = req.body

    let cart = await cartRepository.findOne({ where: { userId } })

    if (!cart) {
      cart = cartRepository.create({
        userId,
        items,
        totalItems,
        totalPrice,
      })
    } else {
      cart.items = items
      cart.totalItems = totalItems
      cart.totalPrice = totalPrice
    }

    await cartRepository.save(cart)
    res.status(200).json(cart)
  } catch (error) {
    console.error("Error al actualizar el carrito:", error)
    res.status(500).json({ message: "Error en el servidor" })
  }
}

// Limpiar el carrito
exports.clearCart = async (req, res) => {
  try {
    const cartRepository = getRepository(Cart)
    const userId = req.user.id

    let cart = await cartRepository.findOne({ where: { userId } })

    if (cart) {
      cart.items = []
      cart.totalItems = 0
      cart.totalPrice = 0
      await cartRepository.save(cart)
    }

    res.status(200).json({ message: "Carrito limpiado exitosamente" })
  } catch (error) {
    console.error("Error al limpiar el carrito:", error)
    res.status(500).json({ message: "Error en el servidor" })
  }
}
