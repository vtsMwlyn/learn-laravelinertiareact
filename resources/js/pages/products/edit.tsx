import { useForm } from '@inertiajs/react';
import { type FormEvent } from 'react';

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

interface Product {
    id: number;
    name: string;
    code: string;
    variant: string;
    manufacturer: string;
    stock: number;
}

export default function edit({product, isOpen, onClose}: {product: Product, isOpen: boolean, onClose: () => void}){
    const { data, setData, patch, processing, errors, reset, recentlySuccessful } = useForm({
        name: product.name || '',
        code: product.code || '',
        variant: product.variant || '',
        manufacturer: product.manufacturer || '',
        stock: product.stock || 0,
    });

    const updateProduct = (e: FormEvent) => {
        e.preventDefault();

        patch(route('api.products.update', {product: product.id}), {
            onSuccess: () => {
                reset();
            },
            preserveScroll: true,
        });
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogTrigger asChild>
                <Button><i className="bi bi-pencil-square"></i></Button>
            </DialogTrigger>

            <DialogContent>
                <form onSubmit={updateProduct}>
                    <DialogHeader>
                        <DialogTitle>Edit Product</DialogTitle>
                    </DialogHeader>

                    <div className="flex flex-col gap-4 my-4">
                        <div className="grid gap-2">
                            <Label htmlFor="name">Product Name</Label>
                            <Input
                                id="name"
                                type="text"
                                required
                                autoFocus
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
                                value={data.code}
                                onChange={(e) => setData('code', e.target.value)}
                            />
                            <InputError message={errors.code} />
                        </div>
                        
                        <div className="grid gap-2">
                            <Label htmlFor="variant">Product Variant</Label>
                            <Input
                                id="variant"
                                value={data.variant}
                                onChange={(e) => setData('variant', e.target.value)}
                            />
                            <InputError message={errors.variant} />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="manufacturer">Product Manufacturer</Label>
                            <Input
                                id="manufacturer"
                                value={data.manufacturer}
                                onChange={(e) => setData('manufacturer', e.target.value)}
                            />
                            <InputError message={errors.manufacturer} />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="manufacturer">Product Stock</Label>
                            <Input
                                id="stock"
                                type="number"
                                value={data.stock}
                                onChange={(e) => setData('stock', Number(e.target.value))}
                            />
                            <InputError message={errors.stock} />
                        </div>
                    </div>
                    
                    <DialogFooter>
                        <div className="w-full flex flex-col items-start gap-6 mt-4">
                            {recentlySuccessful && <div className="text-sm text-green-600">Saved successfully!</div>}

                            <Button type="submit" className="self-end" disabled={processing}>
                                {processing ? 'Saving...' : 'Save'}
                            </Button>
                        </div>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}