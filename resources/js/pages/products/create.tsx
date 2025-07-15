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

type ProductForm = {
    name: string;
    variant: string;
    code: string;
    image: File | null;
    manufacturer: string;
    stock: number;
};

export default function create({isOpen, onClose}: {isOpen: boolean, onClose: () => void}){
    const { data, setData, post, processing, errors, reset, recentlySuccessful } = useForm<ProductForm>({
        name: '',
        variant: '',
        code: '',
        image: null, // For file upload only
        manufacturer: '',
        stock: 0,
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

    const storeProduct = (e: FormEvent) => {
        e.preventDefault();

        post(route('api.products.store'), {
            forceFormData: true, // For file upload only
            onSuccess: () => {
                setImagePreview(null); // For file upload only
                setData('image', null); // For file upload only
                if (fileInputRef.current) {
                    fileInputRef.current.value = "";
                } // For file upload only

                reset();
            },
            preserveScroll: true,
        });
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent>
                <form onSubmit={storeProduct}>
                    <DialogHeader>
                        <DialogTitle>Add New Product</DialogTitle>
                        <DialogDescription>
                            Please fill in the required data.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="flex flex-col gap-4 my-4 max-h-[600px] overflow-y-auto">
                        <div className="grid gap-2">
                            <Label htmlFor="name">Product Name</Label>
                            <Input
                                id="name"
                                type="text"
                                autoFocus
                                tabIndex={1}
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
                                type="text"
                                tabIndex={1}
                                value={data.variant}
                                onChange={(e) => setData('variant', e.target.value)}
                                placeholder="Enter product variant"
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

                        {imagePreview && (
                            <img
                                src={imagePreview}
                                alt="Preview"
                                className="w-1/2 object-cover object-center rounded-lg border"
                            />
                        )}

                        <div className="grid gap-2">
                            <Label htmlFor="code">Product Code</Label>
                            <Input
                                id="code"
                                type="text"
                                tabIndex={1}
                                value={data.code}
                                onChange={(e) => setData('code', e.target.value)}
                                placeholder="Enter product code"
                            />
                            <InputError message={errors.code} />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="manufacturer">Product Manufacturer</Label>
                            <Input
                                id="manufacturer"
                                type="text"
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
                                tabIndex={1}
                                value={data.stock}
                                onChange={(e) => setData('stock', Number(e.target.value))}
                                placeholder="Enter product stock"
                            />
                            <InputError message={errors.stock} />
                        </div>
                    </div>

                    <DialogFooter>
                        <div className="w-full flex flex-col items-start gap-6 mt-4">
                            {recentlySuccessful && <div className="font-semibold text-green-600">Submitted successfully!</div>}

                            <Button type="submit" className="self-end" disabled={processing}>
                                {processing ? 'Submitting...' : 'Submit'}
                            </Button>
                        </div>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}
