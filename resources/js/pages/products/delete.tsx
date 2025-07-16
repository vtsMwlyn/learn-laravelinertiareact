import { useForm } from '@inertiajs/react';
import { type FormEvent } from 'react';

import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogFooter,
} from '@/components/ui/dialog';

type Product = {
    id: number;
    name: string;
    code: string;
    variant: string;
    manufacturer: string;
    stock: number;
}

export default function del({product, isOpen, onClose}: {product: Product, isOpen: boolean, onClose: () => void}){
    const { processing, delete: destroy } = useForm();

    const destroyProduct = (e: FormEvent) => {
        e.preventDefault();

        destroy(route('api.products.destroy', {product: product.id}), {
            onSuccess: () => {
                onClose();
            },
            preserveScroll: true,
        });
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent>
                <form onSubmit={destroyProduct}>
                    <DialogHeader>
                        <DialogTitle>Delete Product</DialogTitle>
                    </DialogHeader>

                    <DialogDescription>
                        <p className="mt-4">Are you sure want to delete this item: <strong>{product.name}</strong>? This action cannot be undone!</p>
                    </DialogDescription>

                    <DialogFooter>
                        <div className="w-full flex flex-col items-start gap-6 mt-4">
                            <Button type="submit" className="self-end" disabled={processing}>
                                {processing ? 'Deleting...' : 'Delete'}
                            </Button>
                        </div>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}
