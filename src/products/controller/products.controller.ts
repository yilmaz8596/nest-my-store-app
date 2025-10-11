import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  ParseIntPipe,
  Render,
  Res,
  UseInterceptors,
  UploadedFile,
  Req,
} from '@nestjs/common';
import { ProductsService } from '../service/products.service';
import { ProductDTO } from '../../DTO/product.dto';
import { EditProductDTO } from '../../DTO/edit.product.dto';
import type { Response, Request } from 'express';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { UserService } from '../../users/service/user/user.service';
import { UserDTO } from '../../DTO/user.dto';

@Controller('mystore')
export class ProductsController {
  constructor(
    private readonly productsService: ProductsService,
    private readonly userService: UserService,
  ) {}

  // Web view routes
  @Get('home')
  @Render('home')
  async renderHomePage(@Req() req: Request | any) {
    const userId = req.cookies?.userId;
    let user: Omit<UserDTO, 'password'> | null = null;

    console.log('Session ID:', req.sessionID);
    console.log('Session Data:', req.session);
    console.log('User ID from cookie:', userId);

    if (userId) {
      user = await this.userService.findUserById(Number(userId));
      console.log('User fetched from DB:', JSON.stringify(user));
      console.log('User role:', user?.role);
      console.log('Role type:', typeof user?.role);
    }

    const products = await this.productsService.getAllProducts();
    console.log('Passing user to view:', JSON.stringify(user));
    return { products, user };
  }

  @Get('product/:id')
  @Render('product-detail')
  async renderProductDetail(
    @Param('id', ParseIntPipe) id: number,
    @Req() req: Request,
  ) {
    const userId = req.cookies?.userId;
    let user: Omit<UserDTO, 'password'> | null = null;

    if (userId) {
      user = await this.userService.findUserById(Number(userId));
    }

    const product = await this.productsService.getProductById(id);
    return { product, user };
  }

  @Get('add-product')
  @Render('add-product')
  async renderAddProductPage(@Req() req: Request, @Res() res: Response) {
    const userId = req.cookies?.userId;
    let user: Omit<UserDTO, 'password'> | null = null;

    if (userId) {
      user = await this.userService.findUserById(Number(userId));
    }

    // Redirect non-admin users to home page
    if (!user || user.role !== 'admin') {
      return res.redirect('/mystore/home?error=admin-only');
    }

    return { user };
  }

  @Get('edit-product/:id')
  @Render('edit-product')
  async renderEditProductPage(
    @Param('id', ParseIntPipe) id: number,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    const userId = req.cookies?.userId;
    let user: Omit<UserDTO, 'password'> | null = null;

    if (userId) {
      user = await this.userService.findUserById(Number(userId));
    }

    // Redirect non-admin users to home page
    if (!user || user.role !== 'admin') {
      return res.redirect('/mystore/home?error=admin-only');
    }

    const product = await this.productsService.getProductById(id);
    return { product, user };
  }

  // API routes
  @Get('api/products')
  async getAllProducts(): Promise<ProductDTO[]> {
    return await this.productsService.getAllProducts();
  }

  @Get('api/products/:id')
  async getProductById(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<ProductDTO> {
    return await this.productsService.getProductById(id);
  }

  @Post('api/products')
  async createProductAPI(@Body() productData: ProductDTO): Promise<ProductDTO> {
    return await this.productsService.addProduct(productData);
  }

  @Post('api/products/:id')
  async updateProductAPI(
    @Param('id', ParseIntPipe) id: number,
    @Body() productData: EditProductDTO,
  ): Promise<ProductDTO> {
    return await this.productsService.editProduct(id, productData);
  }

  @Post('api/products/:id/delete')
  async deleteProductAPI(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<{ message: string }> {
    await this.productsService.deleteProduct(id);
    return { message: 'Product deleted successfully' };
  }

  @Post('products/create')
  @UseInterceptors(
    FileInterceptor('image', {
      storage: diskStorage({
        destination: './public/images',
        filename: (req, file, callback) => {
          const uniqueSuffix =
            Date.now() + '-' + Math.round(Math.random() * 1e9);
          const ext = extname(file.originalname);
          const filename = `product-${uniqueSuffix}${ext}`;
          callback(null, filename);
        },
      }),
      fileFilter: (req, file, callback) => {
        if (!file.originalname.match(/\.(jpg|jpeg|png|gif|webp)$/)) {
          return callback(new Error('Only image files are allowed!'), false);
        }
        callback(null, true);
      },
      limits: {
        fileSize: 5 * 1024 * 1024, // 5MB max file size
      },
    }),
  )
  async createProduct(
    @Body() productData: any,
    @UploadedFile() file: Express.Multer.File,
    @Res() res: Response,
    @Req() req: Request,
  ) {
    // Check if user is admin
    const userId = req.cookies?.userId;
    let user: Omit<UserDTO, 'password'> | null = null;

    if (userId) {
      user = await this.userService.findUserById(Number(userId));
    }

    if (!user || user.role !== 'admin') {
      return res.redirect('/mystore/home?error=admin-only');
    }

    try {
      // Determine the image path
      let imagePath: string;
      if (file) {
        // File uploaded
        imagePath = `/images/${file.filename}`;
      } else if (productData.imageUrl) {
        // Image URL provided
        imagePath = productData.imageUrl;
      } else {
        // No image provided
        return res.redirect('/mystore/add-product?error=no-image');
      }

      const newProduct = {
        name: productData.name,
        price: parseFloat(String(productData.price)),
        img: imagePath,
        description: productData.description,
        id: 0, // Temporary ID, will be assigned by the database
        createdAt: new Date(),
      };

      await this.productsService.addProduct(newProduct);
      return res.redirect('/mystore/home');
    } catch (error) {
      console.error('Create product error:', error);
      return res.redirect('/mystore/add-product?error=create-failed');
    }
  }

  @Post('products/:id/update')
  @UseInterceptors(
    FileInterceptor('image', {
      storage: diskStorage({
        destination: './public/images',
        filename: (req, file, callback) => {
          const uniqueSuffix =
            Date.now() + '-' + Math.round(Math.random() * 1e9);
          const ext = extname(file.originalname);
          const filename = `product-${uniqueSuffix}${ext}`;
          callback(null, filename);
        },
      }),
      fileFilter: (req, file, callback) => {
        if (!file.originalname.match(/\.(jpg|jpeg|png|gif|webp)$/)) {
          return callback(new Error('Only image files are allowed!'), false);
        }
        callback(null, true);
      },
      limits: {
        fileSize: 5 * 1024 * 1024, // 5MB max file size
      },
    }),
  )
  async updateProduct(
    @Param('id', ParseIntPipe) id: number,
    @Body() productData: any,
    @UploadedFile() file: Express.Multer.File,
    @Res() res: Response,
    @Req() req: Request,
  ) {
    console.log('Update Product - ID:', id);
    console.log('Update Product - Body:', productData);
    console.log('Update Product - File:', file);

    // Check if user is admin
    const userId = req.cookies?.userId;
    let user: Omit<UserDTO, 'password'> | null = null;

    if (userId) {
      user = await this.userService.findUserById(Number(userId));
    }

    if (!user || user.role !== 'admin') {
      return res.redirect('/mystore/home?error=admin-only');
    }

    try {
      if (!productData) {
        console.log('No product data received');
        return res.redirect('/mystore/edit-product/' + id + '?error=no-data');
      }

      // Determine the image path
      let imagePath: string | undefined;
      if (file) {
        // New file uploaded
        imagePath = `/images/${file.filename}`;
      } else if (productData.imageUrl) {
        // Keep existing image URL from form
        imagePath = productData.imageUrl;
      }

      const editData: EditProductDTO = {
        id: id,
        name: productData.name || undefined,
        price: productData.price
          ? parseFloat(String(productData.price))
          : undefined,
        img: imagePath,
        description: productData.description || undefined,
      };

      console.log('Processed edit data:', editData);

      const result = await this.productsService.editProduct(id, editData);
      console.log('Update result:', result);

      return res.redirect('/mystore/home');
    } catch (error) {
      console.error('Update error:', error);
      return res.redirect(
        '/mystore/edit-product/' + id + '?error=update-failed',
      );
    }
  }

  @Post('products/:id/delete')
  async deleteProduct(
    @Param('id', ParseIntPipe) id: number,
    @Res() res: Response,
    @Req() req: Request,
  ) {
    // Check if user is admin
    const userId = req.cookies?.userId;
    let user: Omit<UserDTO, 'password'> | null = null;

    if (userId) {
      user = await this.userService.findUserById(Number(userId));
    }

    if (!user || user.role !== 'admin') {
      return res.redirect('/mystore/home?error=admin-only');
    }

    try {
      await this.productsService.deleteProduct(id);
      return res.redirect('/mystore/home');
    } catch (error) {
      console.error('Delete error:', error);
      return res.redirect('/mystore/home?error=delete-failed');
    }
  }
}
