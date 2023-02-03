<?php

use Illuminate\Database\Capsule\Manager as Capsule;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;

class CreateActivityHistoryTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Capsule::schema()->create('core_activity_history', function (Blueprint $table) {
            $table->id('Id');
            $table->integer('UserId')->default(0);
            $table->string('ResourceType')->default('');
            $table->string('ResourceId')->default('');
            $table->string('IpAddress')->default();
            $table->string('Action')->default('');
            $table->integer('Timestamp')->default(0);
            $table->string('GuestPublicId')->default('');

            $table->timestamp(\Aurora\System\Classes\Model::CREATED_AT)->nullable();
            $table->timestamp(\Aurora\System\Classes\Model::UPDATED_AT)->nullable();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Capsule::schema()->dropIfExists('core_activity_history');
    }
}
