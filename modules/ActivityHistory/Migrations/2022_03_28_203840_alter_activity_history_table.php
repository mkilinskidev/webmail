<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Capsule\Manager as Capsule;

class AlterActivityHistoryTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        $prefix = Capsule::connection()->getTablePrefix();
        Capsule::statement("ALTER TABLE {$prefix}core_activity_history MODIFY GuestPublicId text");
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        $prefix = Capsule::connection()->getTablePrefix();
        Capsule::statement("ALTER TABLE {$prefix}core_activity_history MODIFY GuestPublicId varchar(255)");
    }
}
