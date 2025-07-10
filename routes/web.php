<?php

use Inertia\Inertia;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    // Page routes
    Route::get('/dashboard', function(){
        return Inertia::render('dashboard');
    })->name('dashboard');

    Route::get('/products', function(){
        return Inertia::render('products/index', [
            'products' => Product::orderBy('name')->get()
        ]);
    })->name('products');

    // API routes
    Route::prefix('/api')->name('api.')->group(function(){
        Route::post('/products/create', function(Request $request){
            $validated = $request->validate([
                'name' => 'required',
                'code' => 'required',
                'variant' => 'required',
                'manufacturer' => 'required',
                'stock' => 'required|integer',
            ]);

            Product::create($validated);

            return redirect()->route('products')->with('status', 'Product created successfully!');

        })->name('products.store');

        Route::patch('/products/{product}', function(Request $request, Product $product){
            $validated = $request->validate([
                'name' => 'required',
                'code' => 'required',
                'variant' => 'required',
                'manufacturer' => 'required',
                'stock' => 'required|integer',
            ]);

            $product->update($validated);

            return redirect()->route('products')->with('status', 'Product edited successfully!');

        })->name('products.update');

        Route::delete('/products/{product}', function(Product $product){
            $product->delete();

            return redirect()->route('products')->with('status', 'Product deleted successfully!');

        })->name('products.destroy');
    });
});

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
