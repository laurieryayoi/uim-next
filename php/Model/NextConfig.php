<?php

namespace App\Models;

class NextConfig extends Model
{
    /**
     * The table associated with the model.
     *
     * @var string
     */
    protected $table = 'uim_next';

    /**
     * 获取配置值
     *
     * @return mixed
     */
    public function getValue()
    {
        switch ($this->type) {
            case 'bool':
                return (bool)      $this->value;
            case 'array':
                return json_decode($this->value, true);
            case 'string':
                return (string)    $this->value;
            default:
                return (string)    $this->value;
        }
    }

    /**
     * 设定配置值
     *
     * @param mixed $value
     * @param User  $user
     *
     * @return bool
     */
    public function setValue($value, $user = null)
    {
        $this->value = $this->typeConversion($value);

        if (!$this->save()) {
            return false;
        }
        return true;
    }

    /**
     * 配置值得类型转换
     *
     * @param mixed $value
     *
     * @return mixed
     */
    public function typeConversion($value)
    {
        switch ($this->type) {
            case 'bool':
                return (string) $value;
            case 'array':
                return json_encode($value, 320);
            case 'string':
                return (string) $value;
            default:
                return (string) $value;
        }
    }
}
