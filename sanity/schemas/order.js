export default {
  name: 'order',
  title: 'Order',
  type: 'document',
  fields: [
    {
      title: 'User',
      name: 'user',
      type: 'reference',
      to: [{ type: 'user' }],
      options: {
        disableNew: true,
      },
    },
    {
      name: 'userName',
      title: 'User Name',
      type: 'string',
    },
    {
      name: 'shippingPrice',
      title: 'Shipping Price',
      type: 'number',
    },
    {
      name: 'taxPrice',
      title: 'Tax Price',
      type: 'number',
    },
    {
      name: 'itemsPrice',
      title: 'itemsPrice',
      type: 'number',
    },
    {
      name: 'totalPrice',
      title: 'Total Price',
      type: 'number',
    },
    {
      name: 'paymentMethod',
      title: 'Payment Method',
      type: 'string',
    },
    {
      name: 'shippingAddress',
      title: 'Shipping Address',
      type: 'shippingAddress',
    },
    {
      name: 'paymentResult',
      title: 'Payment Result',
      type: 'paymentResult',
    },
    {
      name: 'orderItems',
      title: 'Order Items',
      type: 'array',
      of: [
        {
          title: 'Order Item',
          type: 'orderItem',
        },
      ],
    },
    {
      name: 'isPaid',
      title: 'Is Paid',
      type: 'boolean',
    },
    {
      name: 'paidAt',
      title: 'Paid Date',
      type: 'datetime',
    },
    {
      name: 'isDelivered',
      title: 'Is Delivered',
      type: 'boolean',
    },
    {
      name: 'deliveredAt',
      title: 'Delivered At',
      type: 'datetime',
    },
    {
      name: 'createdAt',
      title: 'Created At',
      type: 'datetime',
    },
  ],
};
