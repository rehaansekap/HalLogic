<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class BestGroupVote extends Model
{
    protected $guarded = [];

    public function material()
    {
        return $this->belongsTo(Material::class);
    }

    public function voterGroup()
    {
        return $this->belongsTo(Group::class, 'voter_group_id');
    }

    public function votedGroup()
    {
        return $this->belongsTo(Group::class, 'voted_group_id');
    }

    public function voter()
    {
        return $this->belongsTo(User::class, 'voter_user_id');
    }
}
