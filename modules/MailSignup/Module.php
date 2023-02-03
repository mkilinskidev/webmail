<?php
/**
 * This code is licensed under AGPLv3 license or Afterlogic Software License
 * if commercial version of the product was purchased.
 * For full statements of the licenses see LICENSE-AFTERLOGIC and LICENSE-AGPL3 files.
 */

namespace Aurora\Modules\MailSignup;

/**
 * @license https://www.gnu.org/licenses/agpl-3.0.html AGPL-3.0
 * @license https://afterlogic.com/products/common-licensing Afterlogic Software License
 * @copyright Copyright (c) 2019, Afterlogic Corp.
 *
 * @package Modules
 */
class Module extends \Aurora\System\Module\AbstractModule
{
	public function init()
	{
	}

	/**
	 * Obtains list of module settings for authenticated user.
	 * @return array
	 */
	public function GetSettings()
	{
		\Aurora\System\Api::checkUserRoleIsAtLeast(\Aurora\System\Enums\UserRole::Anonymous);

		return [
			'ServerModuleName'	=> $this->getConfig('ServerModuleName', 'MailSignup'),
			'HashModuleName'	=> $this->getConfig('HashModuleName', 'signup'),
			'CustomLogoUrl'		=> $this->getConfig('CustomLogoUrl', ''),
			'InfoText'			=> $this->getConfig('InfoText', ''),
			'BottomInfoHtmlText'	=> $this->getConfig('BottomInfoHtmlText', ''),
			'DomainList'		=> $this->getConfig('DomainList', [])
		];
	}

	/**
	 * All actions occur in subscriptions
	 *
	 * @param string $Name
	 * @param string $Login
	 * @param string $Password
	 * @return boolean
	 */
	public function Signup($Name, $Login, $Password)
	{
		return false;
	}
}
