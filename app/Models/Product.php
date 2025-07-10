<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Product extends Model
{
    protected $guarded = ['id'];

	public function scopeFilter($query, array $filters){
		$query->when($filters['search'] ?? false, function($query, $search){
			return $query->where('name', 'like', '%' . $search . '%');
		});
	}
}
