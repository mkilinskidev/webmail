<?php
/**
 * This code is licensed under Afterlogic Software License.
 * For full statements of the license see LICENSE file.
 */

namespace Aurora\Modules\ActivityHistory\Models;

use Aurora\Modules\Core\Models\User;

/**
 * @license https://afterlogic.com/products/common-licensing Afterlogic Software License
 * @copyright Copyright (c) 2019, Afterlogic Corp.
 *
 * @property int $Id
 * @property int $UserId
 * @property string $ResourceType
 * @property string $ResourceId
 * @property string $IpAddress
 * @property string $Action
 * @property int $Timestamp
 * @property string $GuestPublicId
 */
class ActivityHistory extends \Aurora\System\Classes\Model
{
	protected $table = 'core_activity_history';

	protected $foreignModel = User::class;
	protected $foreignModelIdColumn = 'UserId'; // Column that refers to an external table

	protected $fillable = [
		'Id',
		'UserId',
		'ResourceType',
		'ResourceId',
		'IpAddress',
		'Action',
		'Timestamp',
		'GuestPublicId'
	];
}
