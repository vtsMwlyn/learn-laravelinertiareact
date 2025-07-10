<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use App\Models\Product;
use Illuminate\Http\Request;

class ProductController extends Controller
{
    public function index(){
        return Inertia::render('products/index', [
            'products' => Product::filter(request(['search']))->orderBy('name')->get()
        ]);
    }

    public function store(Request $request){
        $validated = $request->validate([
            'name' => 'required',
            'code' => 'required',
            'variant' => 'required',
            'manufacturer' => 'required',
            'stock' => 'required|integer',
        ]);

        Product::create($validated);

        return redirect()->route('products')->with('status', 'Product created successfully!');
    }

    public function update(Request $request, Product $product){
        $validated = $request->validate([
            'name' => 'required',
            'code' => 'required',
            'variant' => 'required',
            'manufacturer' => 'required',
            'stock' => 'required|integer',
        ]);

        $product->update($validated);

        return redirect()->route('products')->with('status', 'Product edited successfully!');
    }

    public function destroy(Product $product){
        $product->delete();

        return redirect()->route('products')->with('status', 'Product deleted successfully!');
    }
}
