<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class ProductController extends Controller
{
    public function index(){
        return Inertia::render('products/index', [
            'products' => Product::filter(request(['search']))->orderBy('created_at', 'desc')->get()
        ]);
    }

    public function store(Request $request){
        $validated = $request->validate([
            'name' => 'required',
            'variant' => 'required',
            'code' => 'required',
            'image' => 'required|file|image', // For file upload only
            'manufacturer' => 'required',
            'stock' => 'required|integer',
        ]);

        $path = str_replace('/public', '', url('/')) . '/storage/app/public/' . $request->file('image')->store('product-images'); // For file upload only
        $validated['image_path'] = $path; // For file upload only
        unset($validated['image']); // For file upload only

        Product::create($validated);

        return redirect()->route('products')->with('status', 'Product created successfully!');
    }

    public function update(Request $request, Product $product){
        $validated = $request->validate([
            'name' => 'required',
            'variant' => 'required',
            'code' => 'required',
            'image' => 'nullable|file|image', // For file upload only
            'manufacturer' => 'required',
            'stock' => 'required|integer',
        ]);

        if($request->file('image')){
            $pureStoragePath = str_replace(str_replace('/public', '', url('/')) . '/storage/app/public/', '', $product->image_path);
            Storage::disk('public')->delete($pureStoragePath);
            $path = str_replace('/public', '', url('/')) . '/storage/app/public/' . $request->file('image')->store('product-images');
            $validated['image_path'] = $path;
        } // For file upload only

        unset($validated['image']); // For file upload only

        $product->update($validated);

        return redirect()->route('products')->with('status', 'Product edited successfully!');
    }

    public function destroy(Product $product){
        $pureStoragePath = str_replace(url('/') . '/storage/', '', $product->image_path); // For file upload only
            Storage::disk('public')->delete($pureStoragePath); // For file upload only

        $product->delete();

        return redirect()->route('products')->with('status', 'Product deleted successfully!');
    }
}
