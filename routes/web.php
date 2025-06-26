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
        return Inertia::render('products', [
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
    });
});

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
