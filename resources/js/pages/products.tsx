import { useForm } from '@inertiajs/react';
import { type FormEvent } from 'react'; // Import the event type
import { useEffect } from 'react';
import { useState } from 'react';

import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import InputError from '@/components/input-error';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogFooter,
} from '@/components/ui/dialog';

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

// 1. Your type definition remains the same
type ProductFormData = {
    name: string;
    code: string;
    variant: string;
    manufacturer: string;
    stock: number;
};

// 2. Create a typed variable holding your initial form state
const initialValues: ProductFormData = {
    name: '',
    code: '',
    variant: '',
    manufacturer: '',
    stock: 0,
};

export default function Products({status, products}: {products: Product[], status?: string}){
    // 2. Create a local state to control the visibility of the status message.
    // We initialize its visibility based on whether a 'status' prop was passed on initial load.
    const [isStatusVisible, setIsStatusVisible] = useState(!!status);

    // 3. Use the useEffect hook to handle the timer.
    // This code will run whenever the 'status' prop changes.
    useEffect(() => {
        // If a new status message arrives...
        if (status) {
            // ...make sure the message is visible...
            setIsStatusVisible(true);

            // ...and set a timer to hide it after 5 seconds (5000 milliseconds).
            const timer = setTimeout(() => {
                setIsStatusVisible(false);
            }, 5000);

            // This is a cleanup function. It's a crucial best practice.
            // If the component unmounts (e.g., user navigates away) before the 5 seconds
            // are up, it will clear the timer to prevent memory leaks.
            return () => clearTimeout(timer);
        }
    }, [status]); // The dependency array ensures this effect only re-runs when 'status' changes.

    // Form handling
    const { data, setData, post, processing, errors, reset } = useForm(initialValues);

    const submit = (e: FormEvent) => {
        e.preventDefault();
        post(route('api.products.store'), {
            onSuccess: () => reset(),
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Products" />

            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4 overflow-x-auto">
                <div className="w-full flex justify-between items-center">
                    <h1 className="font-bold">All Product List</h1>
                    <Dialog>
                        <DialogTrigger asChild>
                            <Button>New Product</Button>
                        </DialogTrigger>

                        <DialogContent>
                            <form onSubmit={submit}>
                                <DialogHeader>
                                    <DialogTitle>Add New Product</DialogTitle>
                                    <DialogDescription>
                                        Please fill in the required data.
                                    </DialogDescription>
                                </DialogHeader>

                                <div className="flex flex-col gap-4 my-4">
                                    <div className="grid gap-2">
                                        <Label htmlFor="name">Product Name</Label>
                                        <Input
                                            id="name"
                                            type="text"
                                            required
                                            autoFocus
                                            tabIndex={1}
                                            value={data.name}
                                            onChange={(e) => setData('name', e.target.value)}
                                            placeholder="Enter product name"
                                        />
                                        <InputError message={errors.name} />
                                    </div>

                                    <div className="grid gap-2">
                                        <Label htmlFor="code">Product Code</Label>
                                        <Input
                                            id="code"
                                            type="text"
                                            required
                                            autoFocus
                                            tabIndex={1}
                                            value={data.code}
                                            onChange={(e) => setData('code', e.target.value)}
                                            placeholder="Enter product code"
                                        />
                                        <InputError message={errors.code} />
                                    </div>

                                    <div className="grid gap-2">
                                        <Label htmlFor="variant">Product Variant</Label>
                                        <Input
                                            id="variant"
                                            type="text"
                                            required
                                            autoFocus
                                            tabIndex={1}
                                            value={data.variant}
                                            onChange={(e) => setData('variant', e.target.value)}
                                            placeholder="Enter product variant"
                                        />
                                        <InputError message={errors.variant} />
                                    </div>

                                    <div className="grid gap-2">
                                        <Label htmlFor="manufacturer">Product Manufacturer</Label>
                                        <Input
                                            id="manufacturer"
                                            type="text"
                                            required
                                            autoFocus
                                            tabIndex={1}
                                            value={data.manufacturer}
                                            onChange={(e) => setData('manufacturer', e.target.value)}
                                            placeholder="Enter product manufacturer"
                                        />
                                        <InputError message={errors.manufacturer} />
                                    </div>

                                    <div className="grid gap-2">
                                        <Label htmlFor="stock">Product Stock</Label>
                                        <Input
                                            id="stock"
                                            type="text"
                                            required
                                            autoFocus
                                            tabIndex={1}
                                            value={data.stock}
                                            onChange={(e) => setData('stock', Number(e.target.value))}
                                            placeholder="Enter product stock"
                                        />
                                        <InputError message={errors.stock} />
                                    </div>
                                </div>

                                {isStatusVisible && <div className="mb-4 text-sm font-medium text-green-600">{status}</div>}

                                <DialogFooter>
                                    <Button type="submit">Submit</Button>
                                </DialogFooter>
                            </form>
                        </DialogContent>
                    </Dialog>
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
                                <td>Do something</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </AppLayout>
    )
}