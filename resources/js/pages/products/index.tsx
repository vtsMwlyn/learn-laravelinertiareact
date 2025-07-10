import { useState, useEffect } from 'react';
import { router } from '@inertiajs/react';
import { useDebounce } from 'use-debounce';

import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
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

export default function index({products, filters}: {products: Product[], filters?: {search?: string}}){
    // CRUD states
    const [isCreating, setIsCreating] = useState(false);
    const [isEditing, setIsEditing] = useState<Product | null>(null);
    const [isDeleting, setIsDeleting] = useState<Product | null>(null);

    // Handling live search
    const [searchTerm, setSearchTerm] = useState(filters?.search || '');
    const [debouncedSearchTerm] = useDebounce(searchTerm, 300); // to delay 300 ms

    useEffect(() => {
        const queryData: { search?: string } = {};

        if (debouncedSearchTerm) {
            queryData.search = debouncedSearchTerm;
        }
        
        router.get(route('products'), queryData, { 
            preserveState: true, replace: true,
        });
    }, [debouncedSearchTerm]);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Products" />

            {/* Main content */}
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4 overflow-x-auto">
                <div className="w-full flex flex-col gap-4 items-start">
                    <div className="w-full flex justify-between items-center">
                        <h1 className="font-bold">All Product List</h1>
                        <Input
                            id="search"
                            type="text"
                            className="w-fit"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            placeholder="Search for products..."
                        />
                    </div>
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
                        {products.length > 0 ? products.map((product, index) => (
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
                        )) : (
                            <tr>
                                <td colSpan={7} className="text-center">- No data found -</td>
                            </tr>
                        )}
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