import { useState } from 'react';

import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import CreateProduct from './create';
import EditProduct from './edit';
import DeleteProduct from './delete';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Products',
        href: '/products',
    },
];

interface Product {
    id: number;
    name: string;
    code: string;
    variant: string;
    manufacturer: string;
    stock: number;
}

export default function index({products}: {products: Product[]}){
    const [isCreating, setIsCreating] = useState(false);
    const [isEditing, setIsEditing] = useState<Product | null>(null);
    const [isDeleting, setIsDeleting] = useState<Product | null>(null);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Products" />

            {/* Main content */}
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4 overflow-x-auto">
                <div className="w-full flex justify-between items-center">
                    <h1 className="font-bold">All Product List</h1>
                    <Button type="button" onClick={() => setIsCreating(!isCreating)}><i className="bi bi-plus-lg"></i> Add New Product</Button>
                </div>

                <table>
                    <thead>
                        <tr className="bg-slate-600 text-white">
                            <td>#</td>
                            <td>Product Name</td>
                            <td>Product Code</td>
                            <td>Variant</td>
                            <td>Manufacturer</td>
                            <td>Stock</td>
                            <td>Actions</td>
                        </tr>
                    </thead>
                    <tbody>
                        {products && products.map((product, index) => (
                            <tr key={product.id}>
                                <td>{index + 1}</td>
                                <td>{product.name}</td>
                                <td>{product.code}</td>
                                <td>{product.variant}</td>
                                <td>{product.manufacturer}</td>
                                <td>{product.stock}</td>
                                <td>
                                    <div className="flex gap-1">
                                        <Button type="button" onClick={() => setIsEditing(product)}><i className="bi bi-pencil-square"></i></Button>
                                        <Button type="button" onClick={() => setIsDeleting(product)}><i className="bi bi-trash3"></i></Button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Forms */}
            {isCreating && <CreateProduct isOpen={isCreating} onClose={() => setIsCreating(!isCreating)} />}
            {isEditing && <EditProduct product={isEditing} isOpen={!!isEditing} onClose={() => setIsEditing(null)} />}
            {isDeleting && <DeleteProduct product={isDeleting} isOpen={!!isDeleting} onClose={() => setIsDeleting(null)} />}
        </AppLayout>
    )
}