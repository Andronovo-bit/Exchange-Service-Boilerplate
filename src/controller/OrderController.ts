import type { Request, Response } from 'express';
import { asyncHandler } from '../middleware/AsyncHandler';
import OrderService from '../services/OrderService';
import { inject, injectable } from 'inversify';
import { success, error } from '../middleware/ResponseHandler';
import type { CreateOrderRequestBody } from '../models/order/Order';
import { orderGetTypeSchema } from '../utils/validation/schema';

@injectable()
export class OrderController {
  constructor(@inject(OrderService) private orderService: OrderService) {}

  /**
   * Create a new limit order.
   * @param req - The request object.
   * @param res - The response object.
   * @returns A promise that resolves to the created order.
   * @example POST /v1/order/create/1
   */
  public createOrder = asyncHandler(async (req: Request, res: Response): Promise<Response> => {
    const userId = parseInt(req.params.userId, 10);
    if (isNaN(userId)) {
      return error(res, 400, 'INVALID_USER_ID', 'Invalid user ID');
    }

    const data: CreateOrderRequestBody = req.body;
    const order = await this.orderService.createOrder(userId, data);
    return success(res, 201, order);
  });

  /**
   * Get pending limit orders.
   * @param req - The request object.
   * @param res - The response object.
   * @returns A promise that resolves to the pending orders.
   * @example GET /v1/order/pending/1
   */
  public getPendingOrders = asyncHandler(async (req: Request, res: Response): Promise<Response> => {
    const userId = parseInt(req.params.userId, 10);
    if (isNaN(userId)) {
      return error(res, 400, 'INVALID_USER_ID', 'Invalid user ID');
    }

    const orders = await this.orderService.getPendingOrders(userId);
    return success(res, 200, orders);
  });

  /**
   * Cancel a limit order.
   * @param req - The request object.
   * @param res - The response object.
   * @returns A promise that resolves to the cancelled order.
   * @example PUT /v1/order/cancel/1
   */
  public cancelOrder = asyncHandler(async (req: Request, res: Response): Promise<Response> => {
    const orderId = parseInt(req.params.orderId, 10);
    const userId = parseInt(req.params.userId, 10);
    if (isNaN(userId)) {
      return error(res, 400, 'INVALID_USER_ID', 'Invalid user');
    }

    if (isNaN(orderId)) {
      return error(res, 400, 'INVALID_ORDER_ID', 'Invalid order ID');
    }

    const cancelledOrder = await this.orderService.cancelOrder(orderId);
    return success(res, 200, cancelledOrder);
  });

  /**
   * Process a partial order.
   * @param req - The request object.
   * @param res - The response object.
   * @returns A promise that resolves to the processed order.
   * @example PUT /v1/order/partialprocess/1
   */
  public processPartialOrder = asyncHandler(async (req: Request, res: Response): Promise<Response> => {
    const orderId = parseInt(req.params.orderId, 10);
    if (isNaN(orderId)) {
      return error(res, 400, 'INVALID_ORDER_ID', 'Invalid order ID');
    }

    const { quantity } = req.body;
    if (typeof quantity !== 'number' || quantity <= 0) {
      return error(res, 400, 'INVALID_QUANTITY', 'Quantity must be a positive number');
    }

    const processedOrder = await this.orderService.processPartialOrder(orderId, quantity);
    return success(res, 200, processedOrder);
  });

  /**
   * Complete an order.
   * @param req - The request object.
   * @param res - The response object.
   * @returns A promise that resolves to the completed order.
   * @example PUT /v1/order/complete/1
   */
  public completeOrder = asyncHandler(async (req: Request, res: Response): Promise<Response> => {
    const orderId = parseInt(req.params.orderId, 10);
    if (isNaN(orderId)) {
      return error(res, 400, 'INVALID_ORDER_ID', 'Invalid order ID');
    }

    const completedOrder = await this.orderService.completeOrder(orderId);
    return success(res, 200, completedOrder);
  });

  /**
   * Get market trades with pagination.
   * @param req - The request object.
   * @param res - The response object.
   * @returns A promise that resolves to the paginated list of orders.
   * @description This endpoint is used to get the order history of a user. The template is as follows: /v1/order/history/{userId}?page=1&limit=10&orderType=BUY&orderStates=PENDING&orderStates=COMPLETED
   * @example GET /v1/order/history/1?page=1&limit=10
   * @example GET /v1/order/history/1?page=1&limit=10&orderType=BUY
   * @example GET /v1/order/history/1?page=1&limit=10&orderType=SELL
   * @example GET /v1/order/history/1?page=1&limit=10&orderStates=PENDING&orderStates=COMPLETED
   */
  public getOrderHistory = asyncHandler(async (req: Request, res: Response): Promise<Response> => {
    const userId = parseInt(req.params.userId, 10);

    if (isNaN(userId)) {
      return error(res, 400, 'INVALID_USER_ID', 'Invalid user ID');
    }

    const { error: validationError } = orderGetTypeSchema.validate(req.query);

    if (validationError) {
      return error(res, 400, 'INVALID_QUERY_PARAMS', validationError.details[0].message);
    }

    const orderType = req.query.orderType as string;
    const orderStates = req.query.orderStates as string[];
    const page = parseInt(req.query.page as string, 10) || 1;
    const limit = parseInt(req.query.limit as string, 10) || 10;
    const orders = await this.orderService.getOrders(userId, page, limit, orderType, orderStates);

    return success(res, 200, orders);
  });
}

export default OrderController;
