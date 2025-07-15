import { useForm } from '@inertiajs/react';
import { type FormEvent } from 'react';
import { useState, useRef } from 'react';

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
    variant: string;
    code: string;
    image_path: string;
    manufacturer: string;
    stock: number;
}

type ProductForm = {
    name: string;
    variant: string;
    code: string;
    image: File | null; // For file upload only
    manufacturer: string;
    stock: number;
};

export default function edit({product, isOpen, onClose}: {product: Product, isOpen: boolean, onClose: () => void}){
    const { data, setData, post, processing, errors, reset, recentlySuccessful } = useForm<ProductForm>({
        name: product.name || '',
        variant: product.variant || '',
        code: product.code || '',
        image: null, // For file upload only
        manufacturer: product.manufacturer || '',
        stock: product.stock || 0,
    });

    const [imagePreview, setImagePreview] = useState<string | null>(null); // For file upload only
    const fileInputRef = useRef<HTMLInputElement>(null); // For file upload only

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0] ?? null;
        setData('image', file);

        if (file) {
            setImagePreview(URL.createObjectURL(file));
        } else {
            setImagePreview(null);
        }
    } // For file upload only

    const updateProduct = (e: FormEvent) => {
        e.preventDefault();

        post(route('api.products.update', {product: product.id}), {
            forceFormData: true, // For file upload only
            onSuccess: () => {
                setImagePreview(null); // For file upload only
                setData('image', null); // For file upload only
                if (fileInputRef.current) {
                    fileInputRef.current.value = "";
                } // For file upload only

                setTimeout(() => onClose(), 1000);
            },
            preserveScroll: true,
        });
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent>
                {recentlySuccessful ? (
                    <div className="font-semibold text-green-600">Saved successfully!</div>
                ) : (
                    <form onSubmit={updateProduct}>
                        <DialogHeader>
                            <DialogTitle>Edit Product</DialogTitle>
                        </DialogHeader>

                        <div className="flex flex-col gap-4 my-4 max-h-[600px] overflow-y-auto">
                            <div className="grid gap-2">
                                <Label htmlFor="name">Product Name</Label>
                                <Input
                                    id="name"
                                    type="text"
                                    autoFocus
                                    value={data.name}
                                    onChange={(e) => setData('name', e.target.value)}
                                    placeholder="Enter product name"
                                />
                                <InputError message={errors.name} />
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
                                <Label htmlFor="image">Product Image</Label>
                                <Input
                                    id="image"
                                    type="file"
                                    ref={fileInputRef}
                                    tabIndex={1}
                                    onChange={handleFileChange}
                                    className="file:border-[0.5px] file:border-slate-400 file:text-sm file:px-2"
                                    accept="image/*"
                                />
                                <InputError message={errors.image} />
                            </div>

                            {imagePreview ? (
                                <img
                                    src={imagePreview}
                                    alt="Preview"
                                    className="w-1/2 object-cover object-center rounded-lg border"
                                />
                            ) : product.image_path !== null && (
                                <img
                                    src={product.image_path}
                                    alt="Preview"
                                    className="w-1/2 object-cover object-center rounded-lg border"
                                />
                            )}

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
                                <Button type="submit" className="self-end" disabled={processing}>
                                    {processing ? 'Saving...' : 'Save'}
                                </Button>
                            </div>
                        </DialogFooter>
                    </form>
                )}

            </DialogContent>
        </Dialog>
    )
}
